import { prisma } from '@/lib/prisma';

export interface SessionSummary {
  sessionId: string;
  timeOnSite: number;
  pagesVisited: string[];
  productsViewed: number[];
  searches: string[];
  kitInterest?: string;
  whatsapp?: string;
  events: TrackingEvent[];
  metrics: {
    totalEvents: number;
    uniquePages: number;
    uniqueProducts: number;
    totalSearches: number;
    avgTimePerPage: number;
  };
}

export interface TrackingEvent {
  id: number;
  sessionId: string;
  eventType: string;
  eventData?: any;
  whatsapp?: string;
  createdAt: Date;
}

class TrackingAggregator {
  async getSessionSummary(sessionId: string): Promise<SessionSummary | null> {
    try {
      // Get all events for this session from database
      const events = await prisma.trackingEvent.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' }
      });

      if (events.length === 0) {
        return null;
      }

      // Initialize data structures
      const pagesVisited = new Set<string>();
      const productsViewed = new Set<number>();
      const searches: string[] = [];
      let kitInterest: string | undefined;
      let whatsapp: string | undefined;

      // Process events to extract meaningful data
      events.forEach(event => {
        // Extract whatsapp if available
        if (event.whatsapp && !whatsapp) {
          whatsapp = event.whatsapp;
        }

        // Process based on event type
        switch (event.eventType) {
          case 'page_view':
            if (event.eventData?.path) {
              pagesVisited.add(event.eventData.path);
            }
            break;
          
          case 'product_viewed':
            if (event.eventData?.productId) {
              productsViewed.add(event.eventData.productId);
            }
            break;
          
          case 'search':
            if (event.eventData?.query) {
              searches.push(event.eventData.query);
            }
            break;
          
          case 'kit_viewed':
            if (event.eventData?.kitName) {
              kitInterest = event.eventData.kitName;
            }
            break;
        }
      });

      // Calculate time on site
      const firstEvent = events[0];
      const lastEvent = events[events.length - 1];
      const timeOnSite = lastEvent.createdAt.getTime() - firstEvent.createdAt.getTime();

      // Calculate average time per page
      const uniquePages = pagesVisited.size;
      const avgTimePerPage = uniquePages > 0 ? timeOnSite / uniquePages : 0;

      // Build summary object
      const summary: SessionSummary = {
        sessionId,
        timeOnSite,
        pagesVisited: Array.from(pagesVisited),
        productsViewed: Array.from(productsViewed),
        searches,
        kitInterest,
        whatsapp,
        events: events.map(event => ({
          id: event.id,
          sessionId: event.sessionId,
          eventType: event.eventType,
          eventData: event.eventData,
          whatsapp: event.whatsapp,
          createdAt: event.createdAt
        })),
        metrics: {
          totalEvents: events.length,
          uniquePages: pagesVisited.size,
          uniqueProducts: productsViewed.size,
          totalSearches: searches.length,
          avgTimePerPage
        }
      };

      return summary;
    } catch (error) {
      console.error('Error aggregating session data:', error);
      return null;
    }
  }

  async getSessionsByWhatsApp(whatsapp: string): Promise<string[]> {
    try {
      const sessions = await prisma.trackingEvent.findMany({
        where: { whatsapp },
        select: { sessionId: true },
        distinct: ['sessionId']
      });

      return sessions.map(s => s.sessionId);
    } catch (error) {
      console.error('Error getting sessions by WhatsApp:', error);
      return [];
    }
  }

  async getActiveSessionsCount(): Promise<number> {
    try {
      // Consider sessions active if they have events in the last 30 minutes
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      
      const activeSessions = await prisma.trackingEvent.findMany({
        where: {
          createdAt: { gte: thirtyMinutesAgo }
        },
        select: { sessionId: true },
        distinct: ['sessionId']
      });

      return activeSessions.length;
    } catch (error) {
      console.error('Error getting active sessions count:', error);
      return 0;
    }
  }

  async cleanupOldSessions(daysOld: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
      
      const result = await prisma.trackingEvent.deleteMany({
        where: {
          createdAt: { lt: cutoffDate }
        }
      });

      console.log(`Cleaned up ${result.count} old tracking events`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up old sessions:', error);
      return 0;
    }
  }

  // Helper method to get behavior data in webhook format
  async getBehaviorDataForWebhook(sessionId: string): Promise<{
    timeOnSite: number;
    pagesVisited: string[];
    productsViewed: number[];
    searches: string[];
    kitInterest?: string;
  } | null> {
    const summary = await this.getSessionSummary(sessionId);
    
    if (!summary) {
      return null;
    }

    return {
      timeOnSite: summary.timeOnSite,
      pagesVisited: summary.pagesVisited,
      productsViewed: summary.productsViewed,
      searches: summary.searches,
      kitInterest: summary.kitInterest
    };
  }
}

// Singleton instance
export const trackingAggregator = new TrackingAggregator();

// Convenience functions
export const getSessionSummary = (sessionId: string) => {
  return trackingAggregator.getSessionSummary(sessionId);
};

export const getBehaviorDataForWebhook = (sessionId: string) => {
  return trackingAggregator.getBehaviorDataForWebhook(sessionId);
};

export const getSessionsByWhatsApp = (whatsapp: string) => {
  return trackingAggregator.getSessionsByWhatsApp(whatsapp);
};

export const getActiveSessionsCount = () => {
  return trackingAggregator.getActiveSessionsCount();
};

export const cleanupOldSessions = (daysOld?: number) => {
  return trackingAggregator.cleanupOldSessions(daysOld);
};