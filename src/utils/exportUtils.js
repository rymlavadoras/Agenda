import html2canvas from 'html2canvas'
import html2pdf from 'html2pdf.js'
import { meetingTypeLabels } from '../data/defaultData'

/**
 * Sanitiza el nombre de archivo para evitar caracteres inválidos
 */
const sanitizeFileName = (name) => {
  return name
    .replace(/[^a-z0-9áéíóúñü]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

/**
 * Genera el nombre del archivo basado en el tipo de reunión y fecha
 */
const getFileName = (program, extension) => {
  const meetingTypeLabel = meetingTypeLabels[program.meetingType] || program.meetingType
  const sanitizedType = sanitizeFileName(meetingTypeLabel)
  
  // Formatear fecha a dd-mm-aaaa
  let formattedDate = ''
  if (program.date) {
    // Parsear fecha ISO (aaaa-mm-dd)
    // El formato de program.date siempre es ISO: aaaa-mm-dd
    const dateParts = program.date.split('-')
    if (dateParts.length === 3 && dateParts[0].length === 4) {
      // Formato ISO: aaaa-mm-dd -> convertir a dd-mm-aaaa
      const year = dateParts[0]  // aaaa
      const month = dateParts[1] // mm
      const day = dateParts[2]   // dd
      formattedDate = `${day}-${month}-${year}`
    } else {
      // Fallback: intentar parsear con Date
      try {
        const date = new Date(program.date)
        if (!isNaN(date.getTime())) {
          const day = String(date.getDate()).padStart(2, '0')
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const year = date.getFullYear()
          formattedDate = `${day}-${month}-${year}`
        } else {
          // Si no se puede parsear, usar fecha actual
          const today = new Date()
          const day = String(today.getDate()).padStart(2, '0')
          const month = String(today.getMonth() + 1).padStart(2, '0')
          const year = today.getFullYear()
          formattedDate = `${day}-${month}-${year}`
        }
      } catch (e) {
        // En caso de error, usar fecha actual
        const today = new Date()
        const day = String(today.getDate()).padStart(2, '0')
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const year = today.getFullYear()
        formattedDate = `${day}-${month}-${year}`
      }
    }
  } else {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    formattedDate = `${day}-${month}-${year}`
  }
  
  return `${sanitizedType}-${formattedDate}.${extension}`
}

/**
 * Configuración para html2canvas - según documentación oficial
 * https://html2canvas.hertzen.com/configuration
 */
const getCanvasOptions = (previewElement, highQuality = false) => {
  // Para compartir por WhatsApp, usar mayor calidad
  const scale = highQuality ? 4 : 2
  
  if (!previewElement) {
    return {
      scale: scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: false,
      pixelRatio: highQuality ? 2 : 1
    }
  }

  return {
    scale: scale,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    allowTaint: false,
    removeContainer: false,
    imageTimeout: 15000,
    pixelRatio: highQuality ? 2 : 1,
    // NO especificar width/height - dejar que html2canvas calcule automáticamente
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.getElementById('program-preview')
      if (clonedElement) {
        // Asegurar que el clon tenga las mismas dimensiones y estilos
        clonedElement.style.width = '210mm'
        clonedElement.style.margin = '0 auto'
        clonedElement.style.transform = 'none'
        clonedElement.style.position = 'relative'
        clonedElement.style.height = 'auto'
        clonedElement.style.minHeight = 'auto'
        clonedElement.style.overflow = 'visible'
        clonedElement.style.boxSizing = 'border-box'
        
        // Asegurar que el header no tenga problemas de z-index
        const clonedHeader = clonedElement.querySelector('.preview-top-header')
        if (clonedHeader) {
          clonedHeader.style.position = 'relative'
          clonedHeader.style.zIndex = 'auto'
        }
        
        const clonedLogo = clonedElement.querySelector('.ward-logo')
        if (clonedLogo) {
          clonedLogo.style.position = 'relative'
          clonedLogo.style.zIndex = '1'
        }
        
        const clonedWardName = clonedElement.querySelector('.ward-name')
        if (clonedWardName) {
          clonedWardName.style.position = 'relative'
          clonedWardName.style.zIndex = '1'
        }
      }
    }
  }
}

/**
 * Genera un PDF del programa
 */
export const generatePDF = async (program) => {
  const previewElement = document.getElementById('program-preview')
  
  if (!previewElement) {
    throw new Error('No se encontró el elemento de preview')
  }

  try {
    const opt = {
      margin: [0, 0, 0, 0],
      filename: getFileName(program, 'pdf'),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: getCanvasOptions(previewElement),
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy']
      }
    }

    await html2pdf().set(opt).from(previewElement).save()
  } catch (error) {
    console.error('Error en generatePDF:', error)
    throw new Error('Error al generar el PDF. Por favor, intente nuevamente.')
  }
}

/**
 * Genera una imagen PNG del programa
 */
export const generateImage = async (program) => {
  const previewElement = document.getElementById('program-preview')
  
  if (!previewElement) {
    throw new Error('No se encontró el elemento de preview')
  }

  try {
    // Usar configuración estándar - html2canvas calculará automáticamente las dimensiones
    const canvasOptions = getCanvasOptions(previewElement)
    
    const canvas = await html2canvas(previewElement, canvasOptions)
    
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Error al crear el blob de la imagen')
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = getFileName(program, 'png')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Limpiar el URL después de un tiempo
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 100)
    }, 'image/png', 1.0) // Máxima calidad
  } catch (error) {
    console.error('Error en generateImage:', error)
    throw new Error('Error al generar la imagen. Por favor, intente nuevamente.')
  }
}

/**
 * Comparte el programa por WhatsApp
 */
export const shareViaWhatsApp = async (program) => {
  const previewElement = document.getElementById('program-preview')
  
  if (!previewElement) {
    throw new Error('No se encontró el elemento de preview')
  }

  try {
    // Usar configuración de alta calidad para compartir
    const canvasOptions = getCanvasOptions(previewElement, true)
    
    const canvas = await html2canvas(previewElement, canvasOptions)
    
    // Convertir a blob con máxima calidad
    const fileName = getFileName(program, 'png')
    
    canvas.toBlob(async (blob) => {
      if (!blob) {
        throw new Error('Error al crear el blob de la imagen')
      }

      // Crear un archivo para compartir con el nombre correcto
      const file = new File([blob], fileName, { 
        type: 'image/png',
        lastModified: Date.now()
      })
      
      // Verificar si el navegador soporta Web Share API con archivos
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: fileName.replace('.png', ''),
            text: `Programa de ${meetingTypeLabels[program.meetingType] || 'reunión'}`,
            files: [file]
          })
        } catch (shareError) {
          // Si falla el share, abrir WhatsApp Web
          openWhatsAppWeb(blob, program, fileName)
        }
      } else {
        // Fallback: abrir WhatsApp Web
        openWhatsAppWeb(blob, program, fileName)
      }
    }, 'image/png', 1.0) // Máxima calidad PNG
  } catch (error) {
    console.error('Error en shareViaWhatsApp:', error)
    throw new Error('Error al compartir por WhatsApp. Por favor, intente nuevamente.')
  }
}

/**
 * Abre WhatsApp Web con la imagen
 */
const openWhatsAppWeb = (blob, program, fileName) => {
  const url = URL.createObjectURL(blob)
  const meetingTypeLabel = meetingTypeLabels[program.meetingType] || 'Programa'
  const text = encodeURIComponent(`Programa de ${meetingTypeLabel}`)
  const whatsappUrl = `https://wa.me/?text=${text}`
  
  // Descargar la imagen primero con el nombre correcto
  const link = document.createElement('a')
  link.href = url
  link.download = fileName || getFileName(program, 'png')
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Abrir WhatsApp Web después de un breve delay
  setTimeout(() => {
    window.open(whatsappUrl, '_blank')
    
    // Mostrar instrucciones
    setTimeout(() => {
      alert('La imagen se ha descargado con el nombre correcto. Por favor, adjunta la imagen descargada en WhatsApp Web.')
      
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 1000)
    }, 500)
  }, 300)
}

