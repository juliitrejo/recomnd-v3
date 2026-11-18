import React, { useState, useEffect } from 'react';
import { saveRecommendation, getRecommendations, deleteRecommendation } from './services/recommendationsService';

const MOOD_STYLES = {
  'Para reflexionar': { bg: '#EDE9FE', text: '#5B21B6', border: '#DDD6FE', icon: '🧠' },
  'Para maratonear': { bg: '#FFEDD5', text: '#9A3412', border: '#FED7AA', icon: '🍿' },
  'Para reírse': { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', icon: '😂' },
  'Inspirador': { bg: '#DCFCE7', text: '#166534', border: '#BBF7D0', icon: '✨' },
  'Desconectarse': { bg: '#E0F2FE', text: '#075985', border: '#BAE6FD', icon: '🌙' },
};

const CATEGORY_ICONS = {
  'Película': '🎬',
  'Serie': '📺',
  'Libro': '📖',
};

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

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 0.9rem',
    borderRadius: '0.65rem',
    border: '1px solid #E6E0D6',
    fontSize: '0.9rem',
    backgroundColor: '#FFFFFF',
    color: '#1C1917',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: '0 1px 2px rgba(28, 25, 23, 0.02)'
  };

  const selectStyle = {
    ...inputStyle,
    paddingRight: '2.5rem',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2378716C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.85rem center',
    backgroundSize: '1rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '0.35rem',
    color: '#57534E'
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      color: '#1C1917', 
      padding: 'clamp(1rem, 3vw, 2.5rem) clamp(0.75rem, 2vw, 1.5rem) 4rem',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      textAlign: 'left'
    }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Header Editorial */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem', 
          backgroundColor: '#FFFFFF',
          padding: 'clamp(1.2rem, 2.5vw, 1.75rem) clamp(1rem, 2.5vw, 2rem)',
          borderRadius: '1.1rem',
          border: '1px solid #E6E0D6',
          boxShadow: '0 8px 24px -8px rgba(28, 25, 23, 0.05)',
          gap: '1.25rem',
          flexWrap: 'wrap',
          boxSizing: 'border-box'
        }}>
          <div style={{ flex: '1 1 280px', minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '2.2rem', 
                height: '2.2rem', 
                borderRadius: '0.6rem', 
                backgroundColor: '#FAF7F2', 
                border: '1px solid #E6E0D6', 
                fontSize: '1.1rem' 
              }}>
                🔖
              </span>
              <h1 className="serif-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.4rem)', fontWeight: '800', margin: 0, letterSpacing: '-0.03em', color: '#1C1917', lineHeight: 1 }}>
                Recomnd
              </h1>
            </div>
            <p style={{ color: '#78716C', margin: 0, fontSize: 'clamp(0.88rem, 1.5vw, 0.95rem)', lineHeight: 1.4 }}>
              Tu bitácora cultural de películas, series y libros organizada por mood.
            </p>
          </div>
          
          {/* Buscador */}
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '320px', minWidth: '100%', boxSizing: 'border-box' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#78716C', fontSize: '0.9rem', pointerEvents: 'none' }}>
              🔍
            </span>
            <input 
              type="text" 
              placeholder="Buscar título o quien recomendó..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.7rem 2.2rem 0.7rem 2.5rem', 
                borderRadius: '2rem', 
                border: '1px solid #E6E0D6', 
                backgroundColor: '#FAF7F2', 
                color: '#1C1917',
                fontSize: '0.9rem', 
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                title="Limpiar búsqueda"
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#E6E0D6',
                  color: '#1C1917',
                  border: 'none',
                  borderRadius: '50%',
                  width: '1.3rem',
                  height: '1.3rem',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                ✕
              </button>
            )}
          </div>
        </header>

        {/* Layout Principal a dos columnas */}
        <div className="recomnd-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 360px) 1fr', gap: '2rem', alignItems: 'start', boxSizing: 'border-box' }}>
          
          {/* Formulario */}
          <div className="sticky-form" style={{ 
            position: 'sticky',
            top: '1.25rem',
            backgroundColor: '#FFFFFF', 
            padding: 'clamp(1.25rem, 2vw, 1.75rem)', 
            borderRadius: '1.1rem', 
            border: '1px solid #E6E0D6', 
            borderTop: '4px solid #E05A47',
            boxShadow: '0 10px 25px -5px rgba(28, 25, 23, 0.05)', 
            boxSizing: 'border-box', 
            textAlign: 'left' 
          }}>
            <div style={{ marginBottom: '1.2rem' }}>
              <h3 className="serif-title" style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.2rem 0', color: '#1C1917' }}>
                Nueva recomendación
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#78716C' }}>
                Anotala antes de que te olvides quién te la pasó.
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Título *</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Ej: Crepúsculo, Duna..." 
                  required 
                  style={inputStyle}
                />
              </div>

              {/* Categoría en su propia fila */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Categoría</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  style={selectStyle}
                >
                  <option value="Película">🎬 Película</option>
                  <option value="Serie">📺 Serie</option>
                  <option value="Libro">📖 Libro</option>
                </select>
              </div>

              {/* Mood en su propia fila con espacio cómodo */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Mood / Ocasión</label>
                <select 
                  value={mood} 
                  onChange={(e) => setMood(e.target.value)} 
                  style={selectStyle}
                >
                  <option value="Para reflexionar">🧠 Para reflexionar</option>
                  <option value="Para maratonear">🍿 Para maratonear</option>
                  <option value="Para reírse">😂 Para reírse</option>
                  <option value="Inspirador">✨ Inspirador</option>
                  <option value="Desconectarse">🌙 Desconectarse</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>¿Quién te lo recomendó? *</label>
                <input 
                  type="text" 
                  value={recommender} 
                  onChange={(e) => setRecommender(e.target.value)} 
                  placeholder="Ej: Jazmín, TikTok..." 
                  required 
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '1.35rem' }}>
                <label style={labelStyle}>¿Por qué vale la pena?</label>
                <textarea 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)} 
                  placeholder="Ej: El giro del final es increíble..." 
                  rows="2"
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.4 }}
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary-recomnd"
                style={{ 
                  width: '100%', 
                  backgroundColor: '#E05A47', 
                  color: '#FFFFFF', 
                  padding: '0.8rem 1rem', 
                  borderRadius: '0.65rem', 
                  border: 'none', 
                  fontWeight: '700', 
                  cursor: 'pointer', 
                  fontSize: '0.92rem', 
                  boxSizing: 'border-box',
                  boxShadow: '0 4px 12px rgba(224, 90, 71, 0.22)'
                }}
              >
                + Guardar recomendación
              </button>
            </form>
          </div>

          {/* Listado y Filtros */}
          <div style={{ boxSizing: 'border-box', textAlign: 'left', minWidth: 0 }}>
            
            {/* Barra de Filtros */}
            <div className="filters-container" style={{ 
              display: 'flex', 
              gap: '0.45rem', 
              marginBottom: '1.25rem', 
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              backgroundColor: '#FFFFFF',
              padding: '0.75rem 0.85rem',
              borderRadius: '0.9rem',
              border: '1px solid #E6E0D6',
              WebkitOverflowScrolling: 'touch'
            }}>
              {['Todos', 'Para reflexionar', 'Para maratonear', 'Para reírse', 'Inspirador', 'Desconectarse'].map((m) => {
                const isActive = filterMood === m;
                const moodIcon = MOOD_STYLES[m]?.icon || '✨';
                return (
                  <button 
                    key={m} 
                    className="filter-pill"
                    onClick={() => setFilterMood(m)}
                    style={{ 
                      padding: '0.4rem 0.85rem', 
                      borderRadius: '2rem', 
                      border: '1px solid',
                      borderColor: isActive ? '#E05A47' : '#E6E0D6',
                      backgroundColor: isActive ? '#E05A47' : '#FAF7F2', 
                      color: isActive ? '#FFFFFF' : '#57534E',
                      cursor: 'pointer',
                      fontSize: '0.81rem',
                      fontWeight: isActive ? '700' : '600',
                      boxShadow: isActive ? '0 3px 8px rgba(224, 90, 71, 0.25)' : 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <span>{m === 'Todos' ? '🗂️' : moodIcon}</span>
                    <span>{m}</span>
                  </button>
                );
              })}
            </div>

            {/* Encabezado de la lista */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <h3 className="serif-title" style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: '#1C1917' }}>
                  Mis Recomendaciones
                </h3>
                <span style={{ 
                  backgroundColor: '#E6E0D6', 
                  color: '#1C1917', 
                  fontSize: '0.78rem', 
                  fontWeight: '700', 
                  padding: '0.12rem 0.55rem', 
                  borderRadius: '1rem' 
                }}>
                  {filteredList.length}
                </span>
              </div>
              {filterMood !== 'Todos' && (
                <button 
                  onClick={() => setFilterMood('Todos')}
                  style={{ background: 'none', border: 'none', color: '#E05A47', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                >
                  Ver todas
                </button>
              )}
            </div>

            {loading && (
              <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '1rem', textAlign: 'center', border: '1px solid #E6E0D6' }}>
                <p style={{ color: '#78716C', margin: 0, fontWeight: '500' }}>Sincronizando tu colección...</p>
              </div>
            )}

            {!loading && filteredList.length === 0 && (
              <div style={{ 
                backgroundColor: '#FFFFFF', 
                padding: '2.5rem 1.5rem', 
                borderRadius: '1.1rem', 
                textAlign: 'center', 
                border: '1.5px dashed #D6CFC7' 
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🍿</div>
                <p style={{ color: '#1C1917', margin: '0 0 0.2rem 0', fontSize: '1rem', fontWeight: '700' }}>
                  No hay recomendaciones acá
                </p>
                <p style={{ color: '#78716C', margin: 0, fontSize: '0.85rem' }}>
                  Probá cambiando el filtro o agregá una nueva.
                </p>
              </div>
            )}
            
            {/* Grilla de Tarjetas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.9rem' }}>
              {filteredList.map((item) => {
                const moodTheme = MOOD_STYLES[item.mood] || { bg: '#F5F5F4', text: '#44403C', border: '#E7E5E4', icon: '✨' };
                const categoryIcon = CATEGORY_ICONS[item.category] || '🎬';
                const initial = (item.recommender || '?').trim().charAt(0).toUpperCase();

                return (
                  <div 
                    key={item.id} 
                    className="rec-card"
                    style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '1.2rem 1.25rem', 
                      borderRadius: '1rem', 
                      border: '1px solid #E6E0D6', 
                      borderLeft: `5px solid ${moodTheme.border}`,
                      boxShadow: '0 4px 12px rgba(28, 25, 23, 0.03)', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start', 
                      gap: '0.75rem',
                      boxSizing: 'border-box', 
                      textAlign: 'left' 
                    }}
                  >
                    <div style={{ overflowWrap: 'break-word', wordBreak: 'break-word', flex: 1, minWidth: 0 }}>
                      
                      {/* Etiquetas Superiores */}
                      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.55rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ 
                          fontSize: '0.68rem', 
                          backgroundColor: '#EEF2FF', 
                          color: '#4338CA', 
                          border: '1px solid #E0E7FF',
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '2rem', 
                          fontWeight: '700', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <span>{categoryIcon}</span>
                          <span>{item.category}</span>
                        </span>

                        <span style={{ 
                          fontSize: '0.72rem', 
                          backgroundColor: moodTheme.bg, 
                          color: moodTheme.text, 
                          border: `1px solid ${moodTheme.border}`,
                          padding: '0.2rem 0.65rem', 
                          borderRadius: '2rem', 
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <span>{moodTheme.icon}</span>
                          <span>{item.mood}</span>
                        </span>
                      </div>

                      {/* Título de la obra */}
                      <h4 className="serif-title" style={{ margin: '0 0 0.45rem 0', fontSize: '1.15rem', fontWeight: '800', color: '#1C1917', letterSpacing: '-0.01em' }}>
                        {item.title}
                      </h4>

                      {/* Quién lo recomendó con Avatar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: item.reason ? '0.75rem' : 0 }}>
                        <span style={{
                          width: '1.4rem',
                          height: '1.4rem',
                          borderRadius: '50%',
                          backgroundColor: '#FAF7F2',
                          border: '1px solid #E6E0D6',
                          color: '#E05A47',
                          fontSize: '0.7rem',
                          fontWeight: '800',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: '0'
                        }}>
                          {initial}
                        </span>
                        <span style={{ color: '#78716C', fontSize: '0.84rem' }}>
                          Recomendado por <strong style={{ color: '#1C1917', fontWeight: '700' }}>{item.recommender}</strong>
                        </span>
                      </div>

                      {/* Cita / Motivo */}
                      {item.reason && (
                        <div style={{ 
                          margin: 0, 
                          fontStyle: 'italic', 
                          color: '#57534E', 
                          fontSize: '0.85rem', 
                          backgroundColor: '#FAF7F2', 
                          padding: '0.6rem 0.85rem', 
                          borderRadius: '0.5rem', 
                          borderLeft: '3px solid #E05A47',
                          lineHeight: 1.45
                        }}>
                          “{item.reason}”
                        </div>
                      )}
                    </div>

                    {/* Botón Borrar */}
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="btn-delete-recomnd"
                      title="Eliminar recomendación"
                      style={{ 
                        backgroundColor: '#FEE2E2', 
                        color: '#991B1B', 
                        border: '1px solid #FECACA', 
                        padding: '0.4rem 0.7rem', 
                        borderRadius: '0.5rem', 
                        cursor: 'pointer', 
                        fontSize: '0.75rem', 
                        fontWeight: '700', 
                        flexShrink: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <span>🗑️</span>
                      <span>Borrar</span>
                    </button>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}