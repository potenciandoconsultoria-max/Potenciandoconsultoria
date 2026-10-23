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

// Datos y matriz oficial del PDF: "INTERPRETACIÓN DE RESULTADOS" (Potenciando Autoevaluación PyME)
const RESULTADOS_PDF = {
  fundacional: {
    nombre: 'Etapa Fundacional',
    rango: '0 – 9 puntos',
    descripcionGeneral: 'La empresa opera en modo supervivencia. Todo depende de personas clave, sin procesos documentados ni métricas. Crecer en estas condiciones implica un riesgo operativo muy alto.',
    textosTamano: {
      micro: 'Es común y esperable en esta etapa: recién estás armando las bases. El Diagnóstico Inicial te da el primer mapa antes de sumar estructura.',
      desarrollo: 'Ya tenés algo de escala pero la gestión no acompañó ese crecimiento. Es el momento de ordenar antes de que el caos se vuelva estructural.',
      consolidada: 'Con este tamaño, operar sin procesos documentados implica un riesgo alto: cada decisión importante depende de la memoria de las personas, no de datos.',
      grande: 'Es la combinación más urgente: una empresa grande gestionada de manera informal expone al negocio a errores costosos y difíciles de detectar a tiempo.'
    },
    servicioRecomendado: 'Servicio de claridad y control',
    detalleServicio: 'Primer paso para entender cómo funciona tu empresa hoy: números, decisiones y procesos. Sin plantillas genéricas.'
  },
  ordenamiento: {
    nombre: 'Etapa de Ordenamiento',
    rango: '10 – 18 puntos',
    descripcionGeneral: 'Hay intuición de negocio, la empresa funciona , la gestión de tareas y el control es frágil y muy dependiente de algunas personas claves. El desafío es convertir ese saber en un sistema transferible y medible.',
    textosTamano: {
      micro: 'Es un buen momento para consolidar antes de crecer: instalar rutinas simples de seguimiento evita que el desorden escale junto con la empresa.',
      desarrollo: 'Tenés la escala justa para que un sistema de información marque una diferencia real en cómo se toman las decisiones del día a día.',
      consolidada: 'La brecha entre el tamaño de tu operación y la madurez de tu gestión empieza a generar fricción. Formalizar la información es el paso que sostiene el crecimiento ya logrado.',
      grande: 'En una empresa de este tamaño, seguir gestionando con indicadores informales limita cuánto podés delegar y escalar con seguridad.'
    },
    servicioRecomendado: 'Servicio de profesionalización y gestión integral',
    detalleServicio: 'Diagnóstico para sentar la base, seguido de un informe mensual que convierte los datos de tu empresa en decisiones claras.'
  },
  consolidacion: {
    nombre: 'Etapa de Consolidación / Escala',
    rango: '19 – 27 puntos',
    descripcionGeneral: 'Tenés estructura y métricas básicas, pero los objetivos estratégicos y el sistema de seguimiento todavía son informales. Hay un potencial importante sin aprovechar.',
    textosTamano: {
      micro: 'Estás gestionando con una madurez que muchas empresas más grandes no tienen. El desafío ahora es construir la estructura que sostenga ese nivel cuando el equipo crezca.',
      desarrollo: 'Tu gestión ya está lista para acompañar la siguiente etapa de crecimiento con un sistema formal, no solo con buena intuición.',
      consolidada: 'Es el perfil ideal para pasar de gestionar el día a día a conducir estratégicamente: definir visión, gobierno y objetivos de largo plazo.',
      grande: 'Con esta escala y esta madurez, el foco pasa a la gestión del crecimiento sostenido: gobierno corporativo, cultura y visión de largo plazo.'
    },
    servicioRecomendado: 'Evolución Estratégico',
    detalleServicio: 'Trabajo de fondo: capacitamos a tu equipo y construimos un sistema de gestión que tu empresa puede sostener sin depender de nosotras.'
  }
};

// 1. Puntaje de Tamaño (Preguntas 1 y 2 - máximo 6 puntos)
function calcularTamano(q1Val, q2Val) {
  const pts1 = parseInt(q1Val) || 0;
  const pts2 = (q2Val === '0_prefiero' || !q2Val) ? 0 : (parseInt(q2Val) || 0);
  const totalTamano = pts1 + pts2;

  if (totalTamano <= 1) {
    return {
      key: 'micro',
      nombre: 'Empresa micro',
      nombreCompleto: 'Empresa Micro',
      segmento: 'Cliente Inicial',
      puntos: totalTamano
    };
  } else if (totalTamano <= 3) {
    return {
      key: 'desarrollo',
      nombre: 'Empresa pequeña',
      nombreCompleto: 'Empresa en Desarrollo (equiv. Pequeña)',
      segmento: 'Cliente Avanzado (en transición)',
      puntos: totalTamano
    };
  } else if (totalTamano <= 5) {
    return {
      key: 'consolidada',
      nombre: 'Empresa mediana',
      nombreCompleto: 'Empresa Consolidada (equiv. Mediana)',
      segmento: 'Cliente Avanzado / en Crecimiento',
      puntos: totalTamano
    };
  } else {
    return {
      key: 'grande',
      nombre: 'Empresa grande',
      nombreCompleto: 'Empresa Grande (equiv. Mediana-Grande)',
      segmento: 'Cliente en Crecimiento',
      puntos: totalTamano
    };
  }
}

// 2. Puntaje de Madurez de Gestión (Preguntas 3 a 11 - máximo 27 puntos)
function calcularMadurez(puntos) {
  if (puntos <= 9) {
    return {
      key: 'fundacional',
      stageName: 'Etapa fundacional (0 - 9 puntos)',
      nombre: 'Etapa Fundacional',
      rango: '0 – 9 puntos',
      ...RESULTADOS_PDF.fundacional,
      puntos
    };
  } else if (puntos <= 18) {
    return {
      key: 'ordenamiento',
      stageName: 'Etapa de ordenamiento (10 - 18 puntos)',
      nombre: 'Etapa de Ordenamiento',
      rango: '10 – 18 puntos',
      ...RESULTADOS_PDF.ordenamiento,
      puntos
    };
  } else {
    return {
      key: 'consolidacion',
      stageName: 'Etapa de consolidación / escala (19 - 27 puntos)',
      nombre: 'Etapa de Consolidación / Escala',
      rango: '19 – 27 puntos',
      ...RESULTADOS_PDF.consolidacion,
      puntos
    };
  }
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
  
  // Calcular puntaje de tamaño (preguntas 1 y 2)
  const tamano = calcularTamano(formData.get('q1'), formData.get('q2'));

  // Calcular puntaje de madurez de gestión (preguntas 3 a 11)
  let totalGestion = 0;
  for (let i = 3; i <= 11; i++) {
    const val = parseInt(formData.get(`q${i}`));
    if (!isNaN(val)) totalGestion += val;
  }
  const madurez = calcularMadurez(totalGestion);

  // Variables normalizadas para el email
  const empresaName = (formData.get('empresa') || '').trim();
  const clientName = (formData.get('nombre') || '').trim();
  const clientEmail = (formData.get('email') || '').trim();
  const sectorName = (formData.get('sector') || '').trim();

  const sizeCategory = tamano.nombre; // ej: "Empresa grande"
  const stageName = madurez.stageName; // ej: "Etapa de ordenamiento (10 - 18 puntos)"
  const stageIntro = madurez.descripcionGeneral;
  const sizeSpecificText = madurez.textosTamano[tamano.key];
  const recommendedService = `${madurez.servicioRecomendado}. ${madurez.detalleServicio}`;

  // Asunto requerido por el cliente para la versión Free
  const emailSubject = 'Tus resultados de la Autoevaluación Ágil PyME';

  // Recopilar detalle de respuestas marcadas para USO INTERNO (Potenciando Consultoría)
  const preguntasFree = [
    { name: 'q1', num: '1', text: '¿Cuántos empleados tiene tu empresa (incluido vos)?' },
    { name: 'q2', num: '2', text: '¿En qué rango se ubica la facturación mensual promedio de tu empresa?' },
    { name: 'q3', num: '3', text: '¿Tenés objetivos claros y documentados para este año?' },
    { name: 'q4', num: '4', text: '¿Cómo tomás decisiones en tu empresa?' },
    { name: 'q5', num: '5', text: '¿Tus procesos están documentados?' },
    { name: 'q6', num: '6', text: '¿Podría funcionar tu empresa si la persona clave se ausenta un mes?' },
    { name: 'q7', num: '7', text: '¿Con qué frecuencia analizás información del negocio?' },
    { name: 'q8', num: '8', text: '¿Tenés un tablero de métricas o indicadores de gestión?' },
    { name: 'q9', num: '9', text: '¿Cómo está la alineación entre las áreas o personas de tu empresa?' },
    { name: 'q10', num: '10', text: '¿Cuál describe mejor tu principal desafío de gestión hoy?' },
    { name: 'q11', num: '11', text: '¿Qué esperarías principalmente de trabajar con una consultoría?' }
  ];

  const respuestasTexto = [];
  preguntasFree.forEach(p => {
    const inputChecked = document.querySelector(`input[name="${p.name}"]:checked`);
    if (inputChecked) {
      const labelSpan = inputChecked.closest('label')?.querySelector('span')?.innerText?.trim() || '';
      const val = inputChecked.value;
      const pts = (val === '0_prefiero') ? 'Prefiero no indicarlo' : `${val} pts`;
      respuestasTexto.push(`${p.num}. ${p.text} -> ${labelSpan} (${pts})`);
    }
  });

  const detalleRespuestasInterno = `\n--- DETALLE DE RESPUESTAS MARCADAS POR EL CLIENTE (USO INTERNO) ---\n` + respuestasTexto.join('\n');

  // Texto completo formateado exactamente como en la imagen JPG del directorio
  const fullEmailText = `¡Hola empresaria!

Gracias por realizar la Autoevaluación Ágil PyME para tu empresa "${empresaName}".

Según tus respuestas, tu empresa tiene el tamaño: ${sizeCategory} y se encuentra en la:
**${stageName}**

Diagnóstico de tu etapa:
${stageIntro}

Análisis específico para tu tamaño:
${sizeSpecificText}

Nuestro servicio recomendado:
${recommendedService}

Para conversar sobre cómo podemos ayudarte a implementar esto en ${empresaName}, responde a este correo.

Saludos,
El equipo de Potenciando Consultoría Empresarial.`;

  // ---------- PARÁMETROS PARA EMAILJS (CLIENTE) ----------
  const templateParamsCliente = {
    // Asunto dinámico (compatible con {{subject}}, {{asunto}}, {{title}}, {{email_subject}})
    subject: emailSubject,
    asunto: emailSubject,
    title: emailSubject,
    email_subject: emailSubject,

    // Destinatarios y remitente
    to_name: clientName,
    name: clientName,
    nombre: clientName,
    to_email: clientEmail,
    email: clientEmail,
    email_cliente: clientEmail,
    from_name: 'Potenciando Consultoría Empresarial',

    // Datos de empresa
    empresa_name: empresaName,
    empresa: empresaName,
    sector: sectorName,
    empresa_sector: sectorName,

    // Variables oficiales de template_z20rrro (que genera la maqueta exacta de la imagen JPG)
    stage_name: stageName,
    stage_intro: stageIntro,
    size_category: sizeCategory,
    size_specific_text: sizeSpecificText,
    recommended_service: recommendedService,

    // Compatibilidad para template_meqgght (por si se utiliza esa plantilla en el dashboard)
    res_stage: `Según tus respuestas, tu empresa tiene el tamaño: ${sizeCategory} y se encuentra en la:\n**${stageName}**`,
    res_fortalezas: stageIntro,
    res_alertas: sizeSpecificText,
    res_cruzada: recommendedService,
    res_prioridades: `Para conversar sobre cómo podemos ayudarte a implementar esto en ${empresaName}, responde a este correo.\n\nSaludos,\nEl equipo de Potenciando Consultoría Empresarial.`,

    // Variables de respaldo generales (vacío para que el cliente NO reciba respuestas internas)
    respuestas_detalle: '',
    devolucion: fullEmailText,
    message: fullEmailText
  };

  let emailSentSuccess = true;
  let emailErrorMsg = '';

  // Enviar usando template_z20rrro (plantilla oficial del correo de la imagen JPG)
  // con fallback automático a template_meqgght
  try {
    await emailjs.send('service_nch11cy', 'template_z20rrro', templateParamsCliente, 'mD8knrxEa7uQiQNqM');
    console.log('Email enviado (Free) con template_z20rrro (formato exacto de imagen JPG)');
  } catch (err1) {
    console.warn('Fallo template_z20rrro, intentando con template_meqgght:', err1);
    try {
      await emailjs.send('service_nch11cy', 'template_meqgght', templateParamsCliente, 'mD8knrxEa7uQiQNqM');
      console.log('Email enviado (Free) con fallback template_meqgght');
    } catch (err2) {
      emailSentSuccess = false;
      emailErrorMsg = err2?.text || err2?.message || JSON.stringify(err2);
      console.warn('EmailJS error (Free) en ambos templates:', err2);
    }
  }

  // Enviar copia interna a Potenciando si el remitente no es ellos mismos
  const userEmailLower = clientEmail.toLowerCase();
  if (emailSentSuccess && userEmailLower && userEmailLower !== 'potenciando.consultoria@gmail.com') {
    const templateParamsInterno = {
      ...templateParamsCliente,
      to_email: 'potenciando.consultoria@gmail.com',
      to_name: 'Equipo Potenciando',
      respuestas_detalle: detalleRespuestasInterno,
      // Se concatena a recommended_service, devolucion y message para asegurar que se muestre
      // en el mail interno incluso si la plantilla de EmailJS no incluye el tag {{respuestas_detalle}}
      recommended_service: `${recommendedService}\n\n${detalleRespuestasInterno}`,
      devolucion: `${fullEmailText}\n\n${detalleRespuestasInterno}`,
      message: `${fullEmailText}\n\n${detalleRespuestasInterno}`,
      res_prioridades: `${templateParamsCliente.res_prioridades}\n\n${detalleRespuestasInterno}`
    };
    try {
      await emailjs.send('service_nch11cy', 'template_z20rrro', templateParamsInterno, 'mD8knrxEa7uQiQNqM');
    } catch (eInterno) {
      console.warn('Fallo template_z20rrro interno, intentando fallback template_meqgght:', eInterno);
      try {
        await emailjs.send('service_nch11cy', 'template_meqgght', templateParamsInterno, 'mD8knrxEa7uQiQNqM');
      } catch (errFallback) {
        console.warn('No se pudo enviar copia interna a Potenciando:', errFallback);
      }
    }
  }

  // Mostrar resultados en pantalla
  document.getElementById('loading-overlay').classList.remove('active');
  document.getElementById('step-3').classList.remove('step-active');
  document.getElementById('step-4').classList.add('step-active');
  
  document.getElementById('res-stage').innerText = `${madurez.stageName}`;
  document.getElementById('res-size').innerText = `${tamano.nombreCompleto} · ${tamano.segmento}`;
  
  const elDesc = document.getElementById('res-general-desc');
  if (elDesc) elDesc.innerText = madurez.descripcionGeneral;
  
  const elSizeDesc = document.getElementById('res-size-desc');
  if (elSizeDesc) elSizeDesc.innerText = `Según el tamaño de tu empresa: ${madurez.textosTamano[tamano.key]}`;
  
  const elService = document.getElementById('res-service-rec');
  if (elService) elService.innerText = `Servicio recomendado: ${madurez.servicioRecomendado} — ${madurez.detalleServicio}`;
  
  document.getElementById('user-email-display').innerText = clientEmail;

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
