import { useCallback } from 'react'

const PointItem = ({ point, index, onUpdate, onRemove, canRemove }) => {
  const handleChange = useCallback((field, value) => {
    onUpdate(point.id, { [field]: value })
  }, [point.id, onUpdate])

  const handleRemove = useCallback(() => {
    if (canRemove) {
      onRemove(point.id)
    }
  }, [point.id, onRemove, canRemove])

  return (
    <div className="point-item">
      <div className="point-header">
        <span className="point-number">Punto {index}</span>
        {canRemove && (
          <button
            type="button"
            onClick={handleRemove}
            className="btn btn-small btn-remove"
            aria-label={`Eliminar punto ${index}`}
          >
            Eliminar
          </button>
        )}
      </div>

      <div className="form-group">
        <label htmlFor={`point-title-${point.id}`} className="required">
          Título
        </label>
        <input
          type="text"
          id={`point-title-${point.id}`}
          value={point.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="form-control"
          placeholder="Título del punto"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor={`point-responsible-${point.id}`} className="required">
          Responsable
        </label>
        <input
          type="text"
          id={`point-responsible-${point.id}`}
          value={point.responsible}
          onChange={(e) => handleChange('responsible', e.target.value)}
          className="form-control"
          placeholder="Nombre del responsable"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor={`point-observation-${point.id}`}>
          Observación (opcional)
        </label>
        <textarea
          id={`point-observation-${point.id}`}
          value={point.observation}
          onChange={(e) => handleChange('observation', e.target.value)}
          className="form-control"
          placeholder="Observaciones adicionales"
          rows="2"
        />
      </div>
    </div>
  )
}

export default PointItem

