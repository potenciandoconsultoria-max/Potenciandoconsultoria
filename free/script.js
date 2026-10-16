// Datos del cuestionario (solo para cálculo interno)
const preguntas = [];
let currentStep = 1;
const totalSteps = 4; // 3 preguntas + resultados

function updateProgress() {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = progress + '%';
  const txt = document.getElementById('progress-text');
  if (txt) txt.innerText = `Paso ${currentStep} de ${totalSteps - 1}`;
}

function nextStep(step) {
  const cur = document.getElementById(`step-${step}`);
  if (!cur) return;
  const inputs = cur.querySelectorAll('input[required]');
  let ok = true;
  inputs.forEach(i => {
    if (i.type === 'radio') {
      const name = i.name;
      if (!cur.querySelector(`input[name="${name}"]:checked`)) ok = false;
    } else if (!i.value.trim()) {
      ok = false;
      i.style.borderColor = 'red';
    } else {
      i.style.borderColor = '';
    }
  });
  if (!ok) { alert('Completa todas las preguntas requeridas antes de avanzar.'); return; }
  cur.classList.remove('step-active');
  currentStep = step + 1;
  const next = document.getElementById(`step-${currentStep}`);
  if (next) next.classList.add('step-active');
  updateProgress();
  window.scrollTo(0,0);
}

function prevStep(step) {
  document.getElementById(`step-${step}`).classList.remove('step-active');
  currentStep = step - 1;
  document.getElementById(`step-${currentStep}`).classList.add('step-active');
  updateProgress();
  window.scrollTo(0,0);
}

function getEtapaGeneral(puntos) {
  if (puntos <= 14) return 'Etapa inicial (Nivel 1)';
  if (puntos <= 28) return 'Etapa de ordenamiento (Nivel 2)';
  if (puntos <= 42) return 'Etapa de consolidación (Nivel 3)';
  return 'Etapa de integración avanzada (Nivel 4)';
}

async function submitForm() {
  // Validar último paso (step-3)
  const cur = document.getElementById('step-3');
  const inputs = cur.querySelectorAll('input[required]');
  let ok = true;
  inputs.forEach(i => {
    if (i.type === 'radio') {
      const name = i.name;
      if (!cur.querySelector(`input[name="${name}"]:checked`)) ok = false;
    }
  });
  if (!ok) { alert('Completa todas las preguntas requeridas antes de enviar.'); return; }
  document.getElementById('loading-overlay').classList.add('active');

  // Calcular puntaje total simple (suma de valores)
  let total = 0;
  const formData = new FormData(document.getElementById('survey-form'));
  for (let [key, value] of formData.entries()) {
    const val = parseInt(value);
    if (!isNaN(val)) total += val;
  }

  // ---------- ENVIAR EMAIL CON EMAILJS ----------
  const etapa = getEtapaGeneral(total);
  const emailParams = {
    // Variables del template template_meqgght (con alias para compatibilidad total)
    to_email: formData.get('email') || '',
    email_cliente: formData.get('email') || '',
    email: formData.get('email') || '',
    name: formData.get('nombre') || '',
    nombre: formData.get('nombre') || '',
    to_name: formData.get('nombre') || '',
    from_name: 'Potenciando Consultoría Empresarial',
    empresa: formData.get('empresa') || '',
    empresa_name: formData.get('empresa') || '',
    sector: formData.get('sector') || '',
    title: 'Diagnóstico Empresarial Gratuito',
    res_stage: `${etapa} (${total}/57 pts)`,
    res_fortalezas: 'Versión gratuita — Para un análisis detallado de fortalezas, accedé al Diagnóstico Profesional.',
    res_alertas: 'Versión gratuita — Para un análisis detallado de alertas, accedé al Diagnóstico Profesional.',
    res_cruzada: 'Versión gratuita — La lectura cruzada está disponible en el Diagnóstico Profesional.',
    res_prioridades: 'Versión gratuita — Las prioridades detalladas están disponibles en el Diagnóstico Profesional.'
  };

  let emailSentSuccess = true;
  let emailErrorMsg = '';

  try {
    await emailjs.send('service_nch11cy', 'template_meqgght', emailParams, 'mD8knrxEa7uQiQNqM');
    console.log('Email enviado (Free) via EmailJS');
  } catch (e) {
    emailSentSuccess = false;
    emailErrorMsg = e?.text || e?.message || JSON.stringify(e);
    console.warn('EmailJS error (Free):', e);
  }

  // Mostrar resultados
  document.getElementById('loading-overlay').classList.remove('active');
  document.getElementById('step-3').classList.remove('step-active');
  document.getElementById('step-4').classList.add('step-active');
  document.getElementById('res-stage').innerText = `${getEtapaGeneral(total)} (${total}/57 pts)`;
  document.getElementById('res-size').innerText = getEtapaGeneral(total);
  document.getElementById('user-email-display').innerText = formData.get('email');

  if (!emailSentSuccess) {
    const subNotice = document.createElement('div');
    subNotice.style.cssText = 'background: rgba(255, 165, 0, 0.15); border: 1px solid #ffa500; color: #ffcc80; padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; margin-top: 15px; margin-bottom: 15px;';
    subNotice.innerHTML = `⚠️ <strong>Nota:</strong> Tu evaluación se procesó con éxito en pantalla, pero hubo un problema al despachar el correo automático (<em>${emailErrorMsg || 'Verificá tu conexión o la casilla ingresada'}</em>). Te recomendamos guardar una captura de este resultado.`;
    const step4El = document.getElementById('step-4');
    step4El.insertBefore(subNotice, document.getElementById('diagnostic-box'));
  }

  updateProgress();
}

window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitForm = submitForm;
