export default function AdminDashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Admin Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>Painel administrativo funcionando!</p>
      
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Sistema Funcionando</h2>
        <p>✅ Autenticação OK</p>
        <p>✅ Layout OK</p>
        <p>✅ Página OK</p>
      </div>
    </div>
  )
}