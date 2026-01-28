import { useState, useCallback } from 'react'
import ProgramForm from './components/ProgramForm'
import ProgramPreview from './components/ProgramPreview'
import { generatePDF, generateImage, shareViaWhatsApp } from './utils/exportUtils'
import { getDefaultProgram, meetingTypeLabels } from './data/defaultData'
import { useTheme } from './contexts/ThemeContext'
import './styles/main.css'

function App() {
  const [program, setProgram] = useState(getDefaultProgram())
  const [isExporting, setIsExporting] = useState(false)
  const { isDarkMode, toggleTheme } = useTheme()

  const handleProgramChange = useCallback((updatedProgram) => {
    setProgram(updatedProgram)
  }, [])

  const handleGeneratePDF = useCallback(async () => {
    setIsExporting(true)
    try {
      await generatePDF(program)
    } catch (error) {
      console.error('Error al generar PDF:', error)
      alert('Error al generar el PDF. Por favor, intente nuevamente.')
    } finally {
      setIsExporting(false)
    }
  }, [program])

  const handleGenerateImage = useCallback(async () => {
    setIsExporting(true)
    try {
      await generateImage(program)
    } catch (error) {
      console.error('Error al generar imagen:', error)
      alert('Error al generar la imagen. Por favor, intente nuevamente.')
    } finally {
      setIsExporting(false)
    }
  }, [program])

  const handleShareWhatsApp = useCallback(async () => {
    setIsExporting(true)
    try {
      await shareViaWhatsApp(program)
    } catch (error) {
      console.error('Error al compartir por WhatsApp:', error)
      alert('Error al compartir por WhatsApp. Por favor, intente nuevamente.')
    } finally {
      setIsExporting(false)
    }
  }, [program])

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Agenda Create</h1>
            <p className="subtitle">Crear programas de reuniones</p>
          </div>
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDarkMode ? (
              <>
                <span className="theme-icon">☀️</span>
                <span className="theme-text">Modo Claro</span>
              </>
            ) : (
              <>
                <span className="theme-icon">🌙</span>
                <span className="theme-text">Modo Oscuro</span>
              </>
            )}
          </button>
        </div>
      </header>
      
      <main className="app-main">
        <div className="form-section">
          <ProgramForm 
            program={program} 
            onProgramChange={handleProgramChange}
          />
        </div>
        
        <div className="preview-section">
          <div className="preview-header">
            <h2>Vista Previa</h2>
            <div className="export-buttons">
              <button 
                onClick={handleGeneratePDF}
                disabled={isExporting}
                className="btn btn-primary"
                aria-label="Generar PDF"
              >
                {isExporting ? 'Generando...' : '📄 Generar PDF'}
              </button>
              <button 
                onClick={handleGenerateImage}
                disabled={isExporting}
                className="btn btn-secondary"
                aria-label="Generar Imagen"
              >
                {isExporting ? 'Generando...' : '🖼️ Generar Imagen'}
              </button>
              <button 
                onClick={handleShareWhatsApp}
                disabled={isExporting}
                className="btn btn-whatsapp"
                aria-label="Compartir por WhatsApp"
              >
                {isExporting ? 'Generando...' : '📱 Compartir WhatsApp'}
              </button>
            </div>
          </div>
          
          <div id="preview-container" className="preview-container">
            <ProgramPreview program={program} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

