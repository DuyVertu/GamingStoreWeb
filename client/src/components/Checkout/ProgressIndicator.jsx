import './ProgressIndicator.css'

function ProgressIndicator({ currentStep }) {
  const steps = [
    { number: 1, title: 'Địa chỉ', label: 'Address' },
    { number: 2, title: 'Vận chuyển', label: 'Shipping' },
    { number: 3, title: 'Thanh toán', label: 'Payment' }
  ]
  
  return (
    <div className="progress-indicator">
      {steps.map((step, index) => (
        <div key={step.number} className="progress-step-wrapper">
          <div className={`progress-step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
            <div className="step-number">
              {currentStep > step.number ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              ) : (
                step.number
              )}
            </div>
            <div className="step-label">
              <span className="step-title">{step.title}</span>
              <span className="step-subtitle">{step.label}</span>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`progress-line ${currentStep > step.number ? 'completed' : ''}`}></div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ProgressIndicator
