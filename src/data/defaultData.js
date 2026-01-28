/**
 * Datos de ejemplo para el programa de reunión
 */

export const getDefaultProgram = () => {
  const today = new Date()
  const dateString = today.toISOString().split('T')[0]
  const timeString = '19:00'

  return {
    id: `program-${Date.now()}`,
    createdAt: today.toISOString(),
    status: 'borrador',
    
    meetingType: 'consejo-barrio',
    date: dateString,
    time: timeString,
    location: 'Capilla del Barrio',
    presider: '',
    
    openingPrayer: '',
    openingHymn: {
      number: '',
      title: ''
    },
    spiritualThought: '',
    
    points: [
      {
        id: `point-${Date.now()}-1`,
        title: '',
        responsible: '',
        observation: ''
      }
    ],
    
    closingHymn: {
      number: '',
      title: ''
    },
    closingPrayer: ''
  }
}

/**
 * Mapeo de tipos de reunión a etiquetas legibles
 */
export const meetingTypeLabels = {
  'consejo-barrio': 'Consejo de Barrio',
  'consejo-obispado': 'Consejo de Obispado',
  'reunion-lideres': 'Reunión de Líderes',
  'actividad': 'Actividad'
}

