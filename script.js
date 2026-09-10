// Datos del cuestionario
const preguntas = [
    // Área 1: Identidad y Estrategia
    { id: 'A1', area: 'A', text: '¿Tenés definida la Misión, Visión y Valores de la empresa?' },
    { id: 'A2', area: 'A', text: '¿Existe algún objetivo estratégico para este año con meta concreta?' },
    { id: 'A3', area: 'A', text: '¿Cómo se toman las decisiones importantes en la empresa?' },
    { id: 'A4', area: 'A', text: '¿El equipo conoce hacia dónde va la empresa y cuál es su rol en eso?' },
    // Área 2: Estructura y Equipo
    { id: 'B1', area: 'B', text: '¿Están definidos los roles y responsabilidades de cada persona?' },
    { id: 'B2', area: 'B', text: '¿Existen procesos clave documentados o dependen de personas específicas?' },
    { id: 'B3', area: 'B', text: '¿La empresa podría seguir funcionando si una persona clave se ausenta un mes?' },
    // Área 3: Ventas y Clientes
    { id: 'C1', area: 'C', text: '¿Sabés cuánto vendés por mes y cuál es el monto promedio de cada venta?' },
    { id: 'C2', area: 'C', text: '¿Conocés cuáles son tus principales clientes o segmentos?' },
    { id: 'C3', area: 'C', text: '¿Se mide la satisfacción de los clientes de alguna forma?' },
    { id: 'C4', area: 'C', text: '¿Existe un proceso claro para captar y hacer seguimiento de nuevos clientes?' },
    // Área 4: Operaciones y Finanzas
    { id: 'D1', area: 'D', text: '¿Conocés el margen de ganancia por producto o servicio principal?' },
    { id: 'D2', area: 'D', text: '¿Sabés con claridad cuánto gasta la empresa por mes y en qué rubros?' },
    { id: 'D3', area: 'D', text: '¿Con qué frecuencia aparecen problemas de stock, entrega o calidad?' },
    { id: 'D4', area: 'D', text: '¿El flujo de caja es predecible o genera sorpresas habitualmente?' },
    // Área 5: Tecnología e Información
    { id: 'E1', area: 'E', text: '¿Qué herramientas usás para gestionar la información del negocio?' },
    { id: 'E2', area: 'E', text: '¿Los informes que usás son manuales o están automatizados?' },
    { id: 'E3', area: 'E', text: '¿La información del negocio está centralizada o dispersa?' },
    { id: 'E4', area: 'E', text: '¿Disponés de algún indicador o dato concreto que se revisa con regularidad?' }
];

const areasInfo = {
    'A': { name: 'Identidad y Estrategia', max: 12, indicador: '— % de objetivos estratégicos del año con seguimiento registrado.\n— Cantidad de instancias de comunicación del rumbo al equipo por trimestre.' },
    'B': { name: 'Estructura y Equipo', max: 9, indicador: '— % de puestos con roles y responsabilidades definidos por escrito.\n— % de procesos clave documentados y actualizados.' },
    'C': { name: 'Ventas y Clientes', max: 12, indicador: '— Monto promedio de venta mensual y su variación.\n— % de clientes principales con seguimiento comercial diferenciado.' },
    'D': { name: 'Operaciones y Finanzas', max: 12, indicador: '— Margen bruto mensual por producto o servicio principal.\n— Desvío entre el flujo de caja proyectado y el real de cada mes.' },
    'E': { name: 'Tecnología e Información', max: 12, indicador: '— % de informes de gestión que se generan de forma automática.\n— Cantidad de indicadores de gestión revisados con regularidad.' }
};

const prioridadesText = {
    'A': 'Empezar a poner por escrito el rumbo de la empresa y compartirlo con el equipo.',
    'B': 'Identificar qué conocimiento clave depende hoy de una sola persona y empezar a registrarlo.',
    'C': 'Ordenar el registro de ventas y clientes para tener una lectura comercial más precisa.',
    'D': 'Ganar visibilidad sobre márgenes, gastos y flujo de caja para reducir sorpresas financieras.',
    'E': 'Centralizar la información del negocio y definir qué datos revisar con regularidad.'
};

const lecturaCruzadaData = [
    { pair: ['A', 'E'], a_gt_b: 'Hay una dirección clara para la empresa, pero todavía es difícil verificar de forma sistemática si las decisiones del día a día efectivamente acercan a esos objetivos. La brecha está en la información que respalda el seguimiento del rumbo.', b_gt_a: 'La empresa genera y ordena información de forma consistente, pero esa información todavía no está conectada con un rumbo estratégico definido. Existe una oportunidad para orientar los datos disponibles hacia las prioridades reales del negocio.' },
    { pair: ['A', 'D'], a_gt_b: 'Existe un rumbo estratégico definido, pero la base financiera y operativa todavía no ofrece la estabilidad necesaria para sostenerlo. Es habitual que la urgencia del día a día termine desplazando el foco puesto en los objetivos de fondo.', b_gt_a: 'Los números del negocio están relativamente controlados, pero sin un rumbo estratégico explícito que oriente hacia dónde destinar ese margen de maniobra. Hay una base sólida para definir objetivos con mayor intención.' },
    { pair: ['B', 'D'], a_gt_b: 'El equipo y los procesos tienen cierta solidez, pero la información financiera todavía no acompaña ese nivel de organización. La estructura está lista para sostener un seguimiento de números más riguroso.', b_gt_a: 'Hay claridad sobre los números del negocio, pero esa información depende en gran medida de personas puntuales para sostenerse. El desafío es que ese conocimiento no quede concentrado en pocas manos.' },
    { pair: ['C', 'E'], a_gt_b: 'El vínculo comercial con los clientes está relativamente bien gestionado, pero esa gestión todavía no se apoya en herramientas o información centralizada. Buena parte de ese conocimiento comercial podría estar más protegido si se sistematiza.', b_gt_a: 'Hay herramientas e información disponibles, pero todavía no se aprovechan plenamente para el seguimiento comercial. Existe una oportunidad de conectar esos datos con la gestión de clientes.' },
    { pair: ['D', 'E'], a_gt_b: 'Los números del negocio se conocen razonablemente bien, pero esa información no está centralizada ni respaldada por herramientas que faciliten su seguimiento. Hoy ese conocimiento depende más de la memoria que de un sistema.', b_gt_a: 'La empresa cuenta con herramientas e indicadores, pero la claridad sobre márgenes y flujo de caja todavía es limitada. Hay una oportunidad de orientar esas herramientas hacia el control financiero.' },
    { pair: ['A', 'B'], a_gt_b: 'El rumbo de la empresa está relativamente claro, pero la estructura para ejecutarlo día a día todavía depende de personas puntuales más que de roles y procesos definidos. Ahí puede estar el mayor freno para avanzar hacia los objetivos planteados.', b_gt_a: 'Hay cierto orden en roles y procesos, pero sin un rumbo estratégico explícito que le dé sentido a ese orden. Existe una base operativa sobre la cual podría apoyarse una definición más clara de objetivos.' }
];

let currentStep = 1;
const totalSteps = 7;

function updateProgress() {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    document.getElementById('progress-bar').firstElementChild.style.width = progress + '%';
    document.getElementById('progress-text').innerText = `Paso ${currentStep} de ${totalSteps}`;
}

function nextStep(step) {
    // Validar el formulario del step actual si hay campos requeridos
    const currentStepEl = document.getElementById(`step-${step}`);
    const inputs = currentStepEl.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.type === 'radio') {
            const name = input.name;
            if (!currentStepEl.querySelector(`input[name="${name}"]:checked`)) {
                isValid = false;
            }
        } else if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });

    if (!isValid) {
        alert('Por favor, completa todas las preguntas requeridas de esta sección.');
        return;
    }

    currentStepEl.classList.remove('step-active');
    currentStep = step + 1;
    document.getElementById(`step-${currentStep}`).classList.add('step-active');
    updateProgress();
    window.scrollTo(0, 0);
}

function prevStep(step) {
    document.getElementById(`step-${step}`).classList.remove('step-active');
    currentStep = step - 1;
    document.getElementById(`step-${currentStep}`).classList.add('step-active');
    updateProgress();
    window.scrollTo(0, 0);
}

function getNivelTexto(porcentaje) {
    if (porcentaje <= 25) return 'Nivel 1 — Inicial';
    if (porcentaje <= 50) return 'Nivel 2 — En desarrollo';
    if (porcentaje <= 75) return 'Nivel 3 — Consolidado';
    return 'Nivel 4 — Avanzado';
}

function getEtapaGeneral(puntos) {
    if (puntos <= 14) return 'Etapa inicial (Nivel 1)';
    if (puntos <= 28) return 'Etapa de ordenamiento (Nivel 2)';
    if (puntos <= 42) return 'Etapa de consolidación (Nivel 3)';
    return 'Etapa de integración avanzada (Nivel 4)';
}

async function submitForm() {
    // Validación final
    const currentStepEl = document.getElementById(`step-6`);
    const inputs = currentStepEl.querySelectorAll('input[required]');
    let isValid = true;
    inputs.forEach(input => {
        if (input.type === 'radio') {
            const name = input.name;
            if (!currentStepEl.querySelector(`input[name="${name}"]:checked`)) {
                isValid = false;
            }
        }
    });
    if (!isValid) {
        alert('Por favor, completa todas las preguntas requeridas de esta sección.');
        return;
    }

    // Mostrar Loader
    document.getElementById('loading-overlay').classList.add('active');

    const formData = new FormData(document.getElementById('survey-form'));
    
    // Calcular puntajes
    let puntajes = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    let respuestasTexto = [];
    let tresPuntos = [];
    let dosPuntos = [];
    let unPunto = [];
    let ceroPuntos = [];
    let totalPuntos = 0;

    preguntas.forEach(p => {
        const val = parseInt(formData.get(p.id));
        puntajes[p.area] += val;
        totalPuntos += val;
        
        const labelText = document.querySelector(`input[name="${p.id}"]:checked`).nextElementSibling.innerText;
        respuestasTexto.push(`${p.id}. ${p.text} -> ${labelText} (${val} pts)`);
        
        let cleanText = labelText.trim().replace(/\.$/, '');
        let lowerText = cleanText.charAt(0).toLowerCase() + cleanText.slice(1);
        
        if (val === 3) tresPuntos.push(lowerText);
        else if (val === 2) dosPuntos.push(lowerText);
        else if (val === 1) unPunto.push(lowerText);
        else if (val === 0) ceroPuntos.push(lowerText);
    });

    // Fortalezas (hasta 4)
    let fortalezas = [...tresPuntos];
    if (fortalezas.length < 4) {
        fortalezas = fortalezas.concat(dosPuntos).slice(0, 4);
    }
    let fortalezasStr = "Tu empresa ya muestra puntos consolidados en su gestión: ";
    if (fortalezas.length === 0) {
        fortalezasStr += "no se registraron puntos consolidados destacados en esta evaluación.";
    } else {
        fortalezas.forEach((f, i) => {
            if (i === 0) fortalezasStr += f + ". ";
            else if (i === 1) fortalezasStr += "Además, " + f + ". ";
            else if (i === 2) fortalezasStr += "A la vez, " + f + ". ";
            else if (i === 3) fortalezasStr += "Por otro lado, " + f + ". ";
        });
    }

    // Alertas (hasta 5)
    let alertas = [...ceroPuntos];
    if (alertas.length < 5) {
        alertas = alertas.concat(unPunto).slice(0, 5);
    }
    let alertasStr = "Hay algunos aspectos que conviene empezar a atender: ";
    if (alertas.length === 0) {
        alertasStr += "no se detectaron alertas de nivel inicial o en desarrollo en esta evaluación.";
    } else {
        alertas.forEach((a, i) => {
            if (i === 0) alertasStr += a + ". ";
            else if (i === 1) alertasStr += "Además, " + a + ". ";
            else if (i === 2) alertasStr += "A la vez, " + a + ". ";
            else if (i === 3) alertasStr += "También conviene atender que " + a + ". ";
            else if (i === 4) alertasStr += "Finalmente, " + a + ". ";
        });
    }

    // Prioridades (3 áreas con menor porcentaje)
    let porcentajesAreas = Object.keys(areasInfo).map(k => {
        return { 
            area: k, 
            pct: (puntajes[k] / areasInfo[k].max) * 100,
            name: areasInfo[k].name,
            nivel: getNivelTexto((puntajes[k] / areasInfo[k].max) * 100)
        };
    });
    
    porcentajesAreas.sort((a, b) => a.pct - b.pct);
    let prioridades = porcentajesAreas.slice(0, 3);
    
    // Lectura Cruzada
    let mayorDistancia = 0;
    let parSeleccionado = null;
    let lecturaCruzadaStr = "Las áreas de gestión están, en general, parejas entre sí.";
    let areasInvolucradasCruzada = [];

    lecturaCruzadaData.forEach(item => {
        let a1 = item.pair[0];
        let a2 = item.pair[1];
        let pct1 = porcentajesAreas.find(a => a.area === a1).pct;
        let pct2 = porcentajesAreas.find(a => a.area === a2).pct;
        let diff = Math.abs(pct1 - pct2);
        if (diff > mayorDistancia) {
            mayorDistancia = diff;
            parSeleccionado = { item, a1, a2, pct1, pct2 };
        }
    });

    if (mayorDistancia >= 25 && parSeleccionado) {
        if (parSeleccionado.pct1 > parSeleccionado.pct2) {
            lecturaCruzadaStr = parSeleccionado.item.a_gt_b;
        } else {
            lecturaCruzadaStr = parSeleccionado.item.b_gt_a;
        }
        areasInvolucradasCruzada = [areasInfo[parSeleccionado.a1].name, areasInfo[parSeleccionado.a2].name];
    }

    // Construcción del texto de prioridades
    let prioridadesFinal = "";
    if (areasInvolucradasCruzada.length > 0) {
        prioridadesFinal += `La brecha principal detectada involucra ${areasInvolucradasCruzada[0]} y ${areasInvolucradasCruzada[1]}. `;
    }
    prioridades.forEach((p, i) => {
        prioridadesFinal += `\n${i+1}. ${p.name}: ${prioridadesText[p.area]}\n${areasInfo[p.area].indicador}\n`;
    });

    let situacionPorAreaStr = porcentajesAreas.map(p => `${p.name}: ${p.nivel}`).join('\n');
    let etapaGeneral = getEtapaGeneral(totalPuntos);
    
    let datosPersonales = `Empresa: ${formData.get('empresa')}
Sector: ${formData.get('sector')}
Nombre: ${formData.get('nombre')}
Email: ${formData.get('email')}`;

    let devolucionCompleta = `
-- FOTO GENERAL --
${etapaGeneral} (Puntaje: ${totalPuntos}/57)

-- SITUACIÓN POR ÁREA --
${situacionPorAreaStr}

-- PRINCIPALES FORTALEZAS --
${fortalezasStr}

-- ALERTAS A TENER EN CUENTA --
${alertasStr}

-- LECTURA CRUZADA --
${lecturaCruzadaStr}

-- PRIORIDADES PARA EMPEZAR --
${prioridadesFinal}
    `;

    // 1. Parámetros para el CLIENTE (sin el detalle de respuestas internas)
    const templateParamsCliente = {
        to_email: formData.get('email'),
        email_cliente: formData.get('email'),
        to_name: formData.get('nombre'),
        from_name: 'Potenciando Consultoría',
        empresa_name: formData.get('empresa'),
        empresa: formData.get('empresa'),
        sector: formData.get('sector'),
        
        size_category: etapaGeneral,
        stage_intro: `FOTO GENERAL:\n${etapaGeneral} (${totalPuntos}/57 pts)\n\nSITUACIÓN POR ÁREA:\n${situacionPorAreaStr}\n\nPRINCIPALES FORTALEZAS:\n${fortalezasStr}\n\nALERTAS A TENER EN CUENTA:\n${alertasStr}\n\nLECTURA CRUZADA:\n${lecturaCruzadaStr}`,
        size_specific_text: `PRIORIDADES PARA EMPEZAR:\n${prioridadesFinal}`,
        recommended_service: `PRÓXIMO PASO:\nEsta evaluación te da una primera fotografía de tu empresa a partir de tus propias respuestas. El paso siguiente es profundizar en los aspectos que aparecen como prioritarios, para entender con más detalle dónde están las principales oportunidades de mejora y qué impacto podrían tener en tu negocio.\n\nContacto: WhatsApp 3416186024 · 3416001679 | Email: potenciando.consultoria@gmail.com`,
        
        // Dejar vacío para que al cliente NO le llegue el desglose interno de respuestas
        respuestas_detalle: '',
        devolucion: devolucionCompleta
    };

    // 2. Parámetros para USO INTERNO (Potenciando Consultoría) con todo el detalle de respuestas
    const templateParamsInterno = {
        ...templateParamsCliente,
        to_email: 'potenciando.consultoria@gmail.com',
        to_name: 'Equipo Potenciando',
        respuestas_detalle: `\n--- DETALLE DE RESPUESTAS MARCADAS POR EL CLIENTE (USO INTERNO) ---\n` + respuestasTexto.join('\n')
    };

    let emailSentSuccess = true;
    let emailErrorMsg = '';

    try {
        // Enviar email al cliente
        await emailjs.send('service_nch11cy', 'template_z20rrro', templateParamsCliente);
        
        // Enviar copia con informe completo de uso interno a Potenciando
        await emailjs.send('service_nch11cy', 'template_z20rrro', templateParamsInterno);
    } catch (error) {
        emailSentSuccess = false;
        emailErrorMsg = error?.text || error?.message || JSON.stringify(error);
        console.error('EmailJS error details:', error);
    }

    // Ocultar Loader y cambiar a la pantalla de resultados (Step 7)
    document.getElementById('loading-overlay').classList.remove('active');
    document.getElementById('step-6').classList.remove('step-active');
    document.getElementById('step-7').classList.add('step-active');
    document.getElementById('user-email-display').innerText = formData.get('email');
    
    // Si hubo un problema con EmailJS (por ejemplo clave pública incorrecta o bloqueo de protocolo local), avisar sutilmente
    if (!emailSentSuccess) {
        console.warn('El correo no se pudo enviar vía EmailJS:', emailErrorMsg);
        const subNotice = document.createElement('div');
        subNotice.style.cssText = 'background: rgba(255, 165, 0, 0.15); border: 1px solid #ffa500; color: #ffcc80; padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 15px;';
        subNotice.innerHTML = `⚠️ <strong>Aviso de prueba:</strong> Tu evaluación se calculó correctamente. El correo no pudo enviarse automáticamente vía EmailJS (Detalle: <em>${emailErrorMsg || 'Verificá tu Public Key de EmailJS'}</em>).`;
        const step7El = document.getElementById('step-7');
        step7El.insertBefore(subNotice, step7El.firstChild.nextSibling);
    }

    // Actualizar UI resultado completo
    document.getElementById('res-stage').innerText = `${etapaGeneral} (${totalPuntos}/57 pts)`;

    const resAreasEl = document.getElementById('res-areas');
    if (resAreasEl) {
        resAreasEl.innerHTML = porcentajesAreas.map(p => `<li style="margin-bottom: 4px;"><strong>${p.name}:</strong> ${p.nivel}</li>`).join('');
    }

    const resFortalezasEl = document.getElementById('res-fortalezas');
    if (resFortalezasEl) {
        resFortalezasEl.innerText = fortalezasStr;
    }

    const resAlertasEl = document.getElementById('res-alertas');
    if (resAlertasEl) {
        resAlertasEl.innerText = alertasStr;
    }

    const resCruzadaEl = document.getElementById('res-cruzada');
    if (resCruzadaEl) {
        resCruzadaEl.innerText = lecturaCruzadaStr;
    }

    const resPrioridadesEl = document.getElementById('res-prioridades');
    if (resPrioridadesEl) {
        let html = '';
        if (areasInvolucradasCruzada.length > 0) {
            html += `<p style="margin-bottom:12px; font-style:italic; color:#e0e0e0;">La brecha principal detectada involucra ${areasInvolucradasCruzada[0]} y ${areasInvolucradasCruzada[1]}.</p>`;
        }
        prioridades.forEach((p, i) => {
            html += `<div style="margin-bottom: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                <strong style="color: var(--secondary-color);">${i+1}. ${p.name}:</strong> ${prioridadesText[p.area]}<br>
                <div style="font-size:0.88rem; color:#cccccc; margin-top: 6px; white-space: pre-line;">${areasInfo[p.area].indicador}</div>
            </div>`;
        });
        resPrioridadesEl.innerHTML = html;
    }

    updateProgress();
}
