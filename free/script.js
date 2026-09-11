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
    to_email: formData.get('email') || '',
    to_name: formData.get('nombre') || '',
    from_name: 'Potenciando Consultoría',
    empresa: formData.get('empresa') || '',
    sector: formData.get('sector') || '',
    email_cliente: formData.get('email') || '',
    empresa_name: formData.get('empresa') || '',
    size_category: etapa,
    res_stage: `${etapa} (${total}/57 pts)`,
    stage_intro: `FOTO GENERAL:\n${etapa} (${total}/57 pts)`,
    size_specific_text: 'Esta es una evaluación inicial gratuita. Para un diagnóstico profesional completo con recomendaciones detalladas, contactanos.',
    recommended_service: 'Contacto: WhatsApp 3416186024 · 3416001679 | Email: potenciando.consultoria@gmail.com',
    devolucion: `Etapa: ${etapa} - Puntaje: ${total}/57 pts`,
    respuestas_detalle: ''
  };

  try {
    await emailjs.send('service_nch11cy', 'template_meqgght', emailParams);
    console.log('Email enviado (Free) via EmailJS');
  } catch (e) {
    console.warn('EmailJS error (Free):', e);
  }

  // Mostrar resultados
  document.getElementById('loading-overlay').classList.remove('active');
  document.getElementById('step-3').classList.remove('step-active');
  document.getElementById('step-4').classList.add('step-active');
  document.getElementById('res-stage').innerText = `${getEtapaGeneral(total)} (${total}/57 pts)`;
  document.getElementById('res-size').innerText = getEtapaGeneral(total);
  document.getElementById('user-email-display').innerText = formData.get('email');
  updateProgress();
}

window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitForm = submitForm;
