import { useState, useEffect, useCallback } from 'react'
import PointItem from './PointItem'
import { meetingTypeLabels } from '../data/defaultData'

const ProgramForm = ({ program, onProgramChange }) => {
  const [localProgram, setLocalProgram] = useState(program)

  useEffect(() => {
    setLocalProgram(program)
  }, [program])

  const updateProgram = useCallback((updates) => {
    const updated = { ...localProgram, ...updates }
    setLocalProgram(updated)
    onProgramChange(updated)
  }, [localProgram, onProgramChange])

  const handleInputChange = useCallback((field, value) => {
    updateProgram({ [field]: value })
  }, [updateProgram])

  const handleHymnChange = useCallback((field, value) => {
    updateProgram({
      openingHymn: {
        ...localProgram.openingHymn,
        [field]: value
      }
    })
  }, [localProgram.openingHymn, updateProgram])

  const handleClosingHymnChange = useCallback((field, value) => {
    updateProgram({
      closingHymn: {
        ...localProgram.closingHymn,
        [field]: value
      }
    })
  }, [localProgram.closingHymn, updateProgram])

  const handleAddPoint = useCallback(() => {
    const newPoint = {
      id: `point-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: '',
      responsible: '',
      observation: ''
    }
    updateProgram({
      points: [...localProgram.points, newPoint]
    })
  }, [localProgram.points, updateProgram])

  const handleUpdatePoint = useCallback((pointId, updates) => {
    const updatedPoints = localProgram.points.map(point =>
      point.id === pointId ? { ...point, ...updates } : point
    )
    updateProgram({ points: updatedPoints })
  }, [localProgram.points, updateProgram])

  const handleRemovePoint = useCallback((pointId) => {
    if (localProgram.points.length <= 1) {
      alert('Debe haber al menos un punto en el programa.')
      return
    }
    const updatedPoints = localProgram.points.filter(point => point.id !== pointId)
    updateProgram({ points: updatedPoints })
  }, [localProgram.points, updateProgram])

  return (
    <div className="program-form">
      <h2>Información del Programa</h2>
      
      <div className="form-group">
        <label htmlFor="meetingType" className="required">
          Tipo de Reunión
        </label>
        <select
          id="meetingType"
          value={localProgram.meetingType}
          onChange={(e) => handleInputChange('meetingType', e.target.value)}
          className="form-control"
          required
        >
          {Object.entries(meetingTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date" className="required">
            Fecha
          </label>
          <input
            type="date"
            id="date"
            value={localProgram.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time" className="required">
            Hora
          </label>
          <input
            type="time"
            id="time"
            value={localProgram.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
            className="form-control"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="location" className="required">
          Lugar
        </label>
        <input
          type="text"
          id="location"
          value={localProgram.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className="form-control"
          placeholder="Ej: Capilla del Barrio"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="presider" className="required">
          Nombre de quien preside
        </label>
        <input
          type="text"
          id="presider"
          value={localProgram.presider}
          onChange={(e) => handleInputChange('presider', e.target.value)}
          className="form-control"
          placeholder="Nombre completo"
          required
        />
      </div>

      <div className="form-section-divider">
        <h3>Apertura</h3>
      </div>

      <div className="form-group">
        <label htmlFor="openingPrayer" className="required">
          Oración inicial
        </label>
        <input
          type="text"
          id="openingPrayer"
          value={localProgram.openingPrayer}
          onChange={(e) => handleInputChange('openingPrayer', e.target.value)}
          className="form-control"
          placeholder="Nombre de quien ofrece la oración"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="openingHymnNumber" className="required">
            Himno inicial - Número
          </label>
          <input
            type="text"
            id="openingHymnNumber"
            value={localProgram.openingHymn.number}
            onChange={(e) => handleHymnChange('number', e.target.value)}
            className="form-control"
            placeholder="Ej: 123"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="openingHymnTitle" className="required">
            Himno inicial - Título
          </label>
          <input
            type="text"
            id="openingHymnTitle"
            value={localProgram.openingHymn.title}
            onChange={(e) => handleHymnChange('title', e.target.value)}
            className="form-control"
            placeholder="Título del himno"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="spiritualThought" className="required">
          Pensamiento espiritual
        </label>
        <input
          type="text"
          id="spiritualThought"
          value={localProgram.spiritualThought}
          onChange={(e) => handleInputChange('spiritualThought', e.target.value)}
          className="form-control"
          placeholder="Texto corto o nombre de quien lo comparte"
          required
        />
      </div>

      <div className="form-section-divider">
        <h3>Desarrollo</h3>
      </div>

      <div className="points-container">
        <div className="points-header">
          <h4>Puntos a tratar</h4>
          <button
            type="button"
            onClick={handleAddPoint}
            className="btn btn-small btn-add"
            aria-label="Agregar punto"
          >
            + Agregar Punto
          </button>
        </div>

        {localProgram.points.map((point, index) => (
          <PointItem
            key={point.id}
            point={point}
            index={index + 1}
            onUpdate={handleUpdatePoint}
            onRemove={handleRemovePoint}
            canRemove={localProgram.points.length > 1}
          />
        ))}
      </div>

      <div className="form-section-divider">
        <h3>Cierre</h3>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="closingHymnNumber" className="required">
            Himno final - Número
          </label>
          <input
            type="text"
            id="closingHymnNumber"
            value={localProgram.closingHymn.number}
            onChange={(e) => handleClosingHymnChange('number', e.target.value)}
            className="form-control"
            placeholder="Ej: 123"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="closingHymnTitle" className="required">
            Himno final - Título
          </label>
          <input
            type="text"
            id="closingHymnTitle"
            value={localProgram.closingHymn.title}
            onChange={(e) => handleClosingHymnChange('title', e.target.value)}
            className="form-control"
            placeholder="Título del himno"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="closingPrayer" className="required">
          Oración final
        </label>
        <input
          type="text"
          id="closingPrayer"
          value={localProgram.closingPrayer}
          onChange={(e) => handleInputChange('closingPrayer', e.target.value)}
          className="form-control"
          placeholder="Nombre de quien ofrece la oración"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">
          Estado del programa
        </label>
        <select
          id="status"
          value={localProgram.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          className="form-control"
        >
          <option value="borrador">Borrador</option>
          <option value="finalizado">Finalizado</option>
        </select>
      </div>
    </div>
  )
}

export default ProgramForm

