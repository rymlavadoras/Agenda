import { useMemo } from 'react'
import { meetingTypeLabels } from '../data/defaultData'
import '../styles/preview.css'

const ProgramPreview = ({ program }) => {
  const formattedDate = useMemo(() => {
    if (!program.date) return ''
    const date = new Date(program.date + 'T00:00:00')
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return date.toLocaleDateString('es-ES', options)
  }, [program.date])

  const formattedTime = useMemo(() => {
    if (!program.time) return ''
    const [hours, minutes] = program.time.split(':')
    const hoursNum = parseInt(hours, 10)
    const minutesNum = parseInt(minutes, 10) || 0
    
    // Convertir a formato 12 horas con AM/PM
    let hours12 = hoursNum
    const ampm = hoursNum >= 12 ? 'PM' : 'AM'
    
    if (hours12 === 0) {
      hours12 = 12 // Medianoche
    } else if (hours12 > 12) {
      hours12 = hours12 - 12
    }
    
    const minutesStr = String(minutesNum).padStart(2, '0')
    return `${hours12}:${minutesStr} ${ampm}`
  }, [program.time])

  const meetingTypeLabel = meetingTypeLabels[program.meetingType] || program.meetingType

  return (
    <div className="program-preview" id="program-preview">
      {/* Header con logo y nombre del barrio */}
      <div className="preview-top-header">
        <div className="logo-container">
          <div className="logo-placeholder">
            <img src="/logo-barrio.jpeg" alt="Logo Barrio Tuman" className="ward-logo" />
          </div>
        </div>
        <div className="ward-name">Barrio Tuman</div>
      </div>

      <div className="preview-content">
        {/* Encabezado */}
        <header className="preview-header-section">
          <h1 className="preview-title">{meetingTypeLabel}</h1>
          <div className="preview-meta">
            <div className="meta-item">
              <span className="meta-label">Fecha:</span>
              <span className="meta-value">{formattedDate || 'No especificada'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Hora:</span>
              <span className="meta-value">{formattedTime || 'No especificada'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Lugar:</span>
              <span className="meta-value">{program.location || 'No especificado'}</span>
            </div>
            {program.presider && (
              <div className="meta-item">
                <span className="meta-label">Preside:</span>
                <span className="meta-value">{program.presider}</span>
              </div>
            )}
          </div>
        </header>

        {/* Apertura */}
        <section className="preview-section">
          <h2 className="section-title">Apertura</h2>
          <div className="section-content">
            {program.openingPrayer && (
              <div className="section-item">
                <span className="item-label">Oración inicial:</span>
                <span className="item-value">{program.openingPrayer}</span>
              </div>
            )}
            {(program.openingHymn.number || program.openingHymn.title) && (
              <div className="section-item">
                <span className="item-label">Himno inicial:</span>
                <span className="item-value">
                  {program.openingHymn.number && `N° ${program.openingHymn.number}`}
                  {program.openingHymn.number && program.openingHymn.title && ' - '}
                  {program.openingHymn.title}
                </span>
              </div>
            )}
            {program.spiritualThought && (
              <div className="section-item">
                <span className="item-label">Pensamiento espiritual:</span>
                <span className="item-value">{program.spiritualThought}</span>
              </div>
            )}
          </div>
        </section>

        {/* Desarrollo */}
        {program.points && program.points.length > 0 && (
          <section className="preview-section">
            <h2 className="section-title">Desarrollo</h2>
            <div className="section-content">
              {program.points.map((point, index) => {
                if (!point.title && !point.responsible) return null
                return (
                  <div key={point.id || index} className="point-preview">
                    <div className="point-number-badge">{index + 1}</div>
                    <div className="point-details">
                      {point.title && (
                        <div className="point-title">{point.title}</div>
                      )}
                      {point.responsible && (
                        <div className="point-responsible">
                          <span className="point-label">Responsable:</span>
                          <span className="point-value">{point.responsible}</span>
                        </div>
                      )}
                      {point.observation && (
                        <div className="point-observation">
                          <span className="point-label">Observación:</span>
                          <span className="point-value">{point.observation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Cierre */}
        <section className="preview-section">
          <h2 className="section-title">Cierre</h2>
          <div className="section-content">
            {(program.closingHymn.number || program.closingHymn.title) && (
              <div className="section-item">
                <span className="item-label">Himno final:</span>
                <span className="item-value">
                  {program.closingHymn.number && `N° ${program.closingHymn.number}`}
                  {program.closingHymn.number && program.closingHymn.title && ' - '}
                  {program.closingHymn.title}
                </span>
              </div>
            )}
            {program.closingPrayer && (
              <div className="section-item">
                <span className="item-label">Oración final:</span>
                <span className="item-value">{program.closingPrayer}</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProgramPreview

