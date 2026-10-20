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
  if (puntos <= 7) return 'Etapa inicial';
  if (puntos <= 14) return 'Etapa de ordenamiento';
  if (puntos <= 21) return 'Etapa de consolidación';
  return 'Etapa de integración avanzada';
}

function getTamanoEmpresa(q1, q2) {
  const billingMap = {
    '0': 'Microempresa (hasta $31,1M/mes)',
    '1': 'Pequeña empresa (hasta $188M/mes)',
    '2': 'Mediana empresa Tramo 1 (hasta $1.555M/mes)',
    '3': 'Mediana empresa Tramo 2 (+ $1.555M/mes)'
  };
  const staffMap = {
    '0': 'Microempresa (hasta 9 personas)',
    '1': 'Pequeña empresa (10 a 30 personas)',
    '2': 'Mediana empresa Tramo 1 (31 a 100 personas)',
    '3': 'Mediana empresa Tramo 2 (+ 100 personas)'
  };
  if (q2 && billingMap[q2]) return billingMap[q2];
  if (q1 && staffMap[q1]) return staffMap[q1];
  return 'MiPyME';
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

  const formData = new FormData(document.getElementById('survey-form'));
  
  // Calcular puntaje de gestión (preguntas 3 a 11)
  let totalGestion = 0;
  for (let i = 3; i <= 11; i++) {
    const val = parseInt(formData.get(`q${i}`));
    if (!isNaN(val)) totalGestion += val;
  }

  const etapa = getEtapaGeneral(totalGestion);
  const tamano = getTamanoEmpresa(formData.get('q1'), formData.get('q2'));

  // ---------- ENVIAR EMAIL CON EMAILJS ----------
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
    title: 'Autoevaluación Ágil PyME — Primer Mirada',
    res_stage: `${etapa} (Tamaño detectado: ${tamano})`,
    res_fortalezas: `A partir de tus respuestas, tu empresa muestra una base de ${tamano} y se encuentra en ${etapa}. Esta evaluación inicial refleja el estado real de tu gestión.`,
    res_alertas: `Esta autoevaluación te brinda la "Primer mirada" objetiva de tu empresa para identificar puntos clave de ordenamiento y mejora.`,
    res_cruzada: `Para profundizar en los 5 ejes de gestión (Identidad, Estructura, Ventas, Operaciones y Tecnología) con devolución exhaustiva, podés solicitar el Diagnóstico Integral.`,
    res_prioridades: `Próximo paso: Definir las prioridades de mejora y avanzar en la consolidación de tus procesos. Contacto directo: potenciando.consultoria@gmail.com`
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
  document.getElementById('res-stage').innerText = etapa;
  document.getElementById('res-size').innerText = tamano;
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
