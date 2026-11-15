import React, { useState, useEffect } from 'react';
import { saveRecommendation, getRecommendations, deleteRecommendation } from './services/recommendationsService';

export default function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Película');
  const [mood, setMood] = useState('Para reflexionar');
  const [recommender, setRecommender] = useState('');
  const [reason, setReason] = useState('');
  const [filterMood, setFilterMood] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await getRecommendations();
    setRecommendations(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !recommender.trim()) {
      alert("Completá el título y quién te lo recomendó.");
      return;
    }

    const nuevaRecTemp = {
      id: Date.now().toString(),
      title,
      category,
      mood,
      recommender,
      reason
    };

    setRecommendations([nuevaRecTemp, ...recommendations]);
    setTitle('');
    setRecommender('');
    setReason('');

    try {
      await saveRecommendation({ title, category, mood, recommender, reason });
      fetchData();
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      alert("No se pudo guardar en la base de datos, revisá tu conexión.");
      fetchData();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás segura de eliminar esta recomendación?")) {
      setRecommendations(recommendations.filter(item => item.id !== id));
      try {
        await deleteRecommendation(id);
      } catch (error) {
        fetchData();
      }
    }
  };

  const filteredList = recommendations.filter(item => {
    const matchesMood = filterMood === 'Todos' || item.mood === filterMood;
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.recommender || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMood && matchesSearch;
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      color: '#0f172a', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
      padding: '2.5rem 1.5rem',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Header totalmente responsivo y sin desbordamientos */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2.5rem', 
          borderBottom: '1px solid #e2e8f0', 
          paddingBottom: '1.5rem', 
          gap: '1.5rem',
          flexWrap: 'wrap',
          boxSizing: 'border-box'
        }}>
          <div style={{ flex: '1 1 300px', minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, letterSpacing: '-0.03em' }}>Recomendar</h1>
              <span style={{ fontSize: '0.75rem', background: '#2563eb', color: '#ffffff', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: 600 }}>v3.0 Estado de ánimo</span>
            </div>
            <p style={{ color: '#64748b', margin: 0, fontSize: '1rem' }}>Guardá películas, series y libros organizados por tu estado de ánimo y ocasión.</p>
          </div>
          
          {/* Buscador perfectamente acotado y seguro */}
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '300px', minWidth: '220px', boxSizing: 'border-box' }}>
            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem', pointerEvents: 'none' }}>
              🔍
            </span>
            <input 
              type="text" 
              placeholder="Buscar título o recomendador..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.65rem 1rem 0.65rem 2.4rem', 
                borderRadius: '0.5rem', 
                border: '1px solid #cbd5e1', 
                background: '#ffffff', 
                fontSize: '0.9rem', 
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </header>

        {/* Layout Principal a dos columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 400px) 1fr', gap: '2rem', alignItems: 'start', boxSizing: 'border-box' }}>
          
          {/* Formulario */}
          <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', boxSizing: 'border-box' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 1.25rem 0' }}>Nueva recomendación</h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.35rem', color: '#1e293b' }}>Título *</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Ej: Severance, Duna, El Eternauta..." 
                  required 
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.35rem', color: '#1e293b' }}>Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="Película">Película</option>
                  <option value="Serie">Serie</option>
                  <option value="Libro">Libro</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.35rem', color: '#1e293b' }}>Estado de ánimo / Ocasión</label>
                <select value={mood} onChange={(e) => setMood(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="Para reflexionar">🧠 Para reflexionar</option>
                  <option value="Para maratonear">🍿 Para maratonear</option>
                  <option value="Para reírse">😂 Para reírse</option>
                  <option value="Inspirador">✨ Inspirador</option>
                  <option value="Desconectarse">🌙 Desconectarse</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.35rem', color: '#1e293b' }}>¿Quién te lo recomendó? *</label>
                <input 
                  type="text" 
                  value={recommender} 
                  onChange={(e) => setRecommender(e.target.value)} 
                  placeholder="Ej: Fran, Profe de diseño, TikTok..." 
                  required 
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.35rem', color: '#1e293b' }}>¿Por qué te dijo que lo ves/leas?</label>
                <textarea 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)} 
                  placeholder="Ej: Me dijo que el giro del final es increíble..." 
                  rows="3"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <button type="submit" style={{ width: '100%', background: '#2563eb', color: '#ffffff', padding: '0.75rem', borderRadius: '0.375rem', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem', boxSizing: 'border-box' }}>
                Guardar recomendación
              </button>
            </form>
          </div>

          {/* Listado y Filtros */}
          <div style={{ boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {['Todos', 'Para reflexionar', 'Para maratonear', 'Para reírse', 'Inspirador', 'Desconectarse'].map((m) => (
                <button 
                  key={m} 
                  onClick={() => setFilterMood(m)}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    borderRadius: '2rem', 
                    border: '1px solid',
                    borderColor: filterMood === m ? '#2563eb' : '#cbd5e1',
                    background: filterMood === m ? '#2563eb' : '#ffffff', 
                    color: filterMood === m ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 'bold', margin: 0 }}>Mis Recomendaciones ({filteredList.length})</h3>
            </div>

            {loading && <p style={{ color: '#64748b' }}>Cargando recomendaciones...</p>}
            {!loading && filteredList.length === 0 && (
              <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '0.75rem', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>No hay recomendaciones con este filtro o búsqueda.</p>
              </div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {filteredList.map((item) => (
                <div key={item.id} style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', boxSizing: 'border-box' }}>
                  <div style={{ paddingRight: '1rem', overflowWrap: 'break-word', wordBreak: 'break-word', flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.7rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.category}</span>
                      <span style={{ fontSize: '0.7rem', background: '#fef08a', color: '#713f12', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontWeight: 'bold' }}>{item.mood}</span>
                    </div>
                    <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a' }}>{item.title}</h4>
                    <p style={{ margin: '0 0 0.4rem 0', color: '#475569', fontSize: '0.875rem' }}>Recomendado por: <strong style={{ color: '#0f172a' }}>{item.recommender}</strong></p>
                    {item.reason && <p style={{ margin: 0, fontStyle: 'italic', color: '#64748b', fontSize: '0.85rem' }}>"{item.reason}"</p>}
                  </div>
                  <button onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', flexShrink: 0 }}>
                    Borrar
                  </button>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}