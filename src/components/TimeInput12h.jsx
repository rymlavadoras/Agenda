import { useCallback, useMemo } from 'react'

const TimeInput12h = ({ value, onChange, id, required, className }) => {
  // Convertir de formato 24h (HH:mm) a formato 12h
  const time12h = useMemo(() => {
    if (!value) return { hour: '12', minute: '00', ampm: 'AM' }
    
    const [hours24, minutes] = value.split(':')
    const hoursNum = parseInt(hours24, 10)
    
    let hours12 = hoursNum
    let ampm = 'AM'
    
    if (hoursNum === 0) {
      hours12 = 12
    } else if (hoursNum === 12) {
      ampm = 'PM'
    } else if (hoursNum > 12) {
      hours12 = hoursNum - 12
      ampm = 'PM'
    }
    
    return {
      hour: String(hours12).padStart(2, '0'),
      minute: minutes || '00',
      ampm
    }
  }, [value])

  // Convertir de formato 12h a formato 24h (HH:mm)
  const convertTo24h = useCallback((hour12, minute, ampm) => {
    let hours24 = parseInt(hour12, 10)
    
    if (ampm === 'PM' && hours24 !== 12) {
      hours24 += 12
    } else if (ampm === 'AM' && hours24 === 12) {
      hours24 = 0
    }
    
    return `${String(hours24).padStart(2, '0')}:${minute}`
  }, [])

  const handleHourChange = useCallback((e) => {
    const newHour = e.target.value
    const time24h = convertTo24h(newHour, time12h.minute, time12h.ampm)
    onChange(time24h)
  }, [time12h.minute, time12h.ampm, convertTo24h, onChange])

  const handleMinuteChange = useCallback((e) => {
    const newMinute = e.target.value
    const time24h = convertTo24h(time12h.hour, newMinute, time12h.ampm)
    onChange(time24h)
  }, [time12h.hour, time12h.ampm, convertTo24h, onChange])

  const handleAmpmChange = useCallback((e) => {
    const newAmpm = e.target.value
    const time24h = convertTo24h(time12h.hour, time12h.minute, newAmpm)
    onChange(time24h)
  }, [time12h.hour, time12h.minute, convertTo24h, onChange])

  // Generar opciones de horas (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1
    return (
      <option key={hour} value={String(hour).padStart(2, '0')}>
        {hour}
      </option>
    )
  })

  // Generar opciones de minutos (00-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => {
    const minute = String(i).padStart(2, '0')
    return (
      <option key={minute} value={minute}>
        {minute}
      </option>
    )
  })

  return (
    <div className="time-input-12h">
      <select
        id={`${id}-hour`}
        value={time12h.hour}
        onChange={handleHourChange}
        className={`form-control ${className || ''}`}
        required={required}
        aria-label="Hora"
      >
        {hourOptions}
      </select>
      <span className="time-separator">:</span>
      <select
        id={`${id}-minute`}
        value={time12h.minute}
        onChange={handleMinuteChange}
        className={`form-control ${className || ''}`}
        required={required}
        aria-label="Minutos"
      >
        {minuteOptions}
      </select>
      <select
        id={`${id}-ampm`}
        value={time12h.ampm}
        onChange={handleAmpmChange}
        className={`form-control ${className || ''}`}
        required={required}
        aria-label="AM/PM"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  )
}

export default TimeInput12h

