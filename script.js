let currentStep = 1;
const totalSteps = 3;

function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const percentage = ((currentStep - 1) / totalSteps) * 100;
    
    progressBar.style.setProperty('--progress', `${percentage}%`);
    progressText.innerText = `Sección ${currentStep} de ${totalSteps}`;
}

function validateStep(step) {
    const currentStepEl = document.getElementById(`step-${step}`);
    const inputs = currentStepEl.querySelectorAll('input[required]');
    
    let isValid = true;
    
    // Check text/email inputs
    inputs.forEach(input => {
        if (input.type === 'text' || input.type === 'email') {
            if (!input.value.trim()) {
                input.reportValidity();
                isValid = false;
            }
        }
    });

    if (!isValid) return false;

    // Check radio groups in this step
    const radioGroups = new Set();
    currentStepEl.querySelectorAll('input[type="radio"]').forEach(radio => {
        radioGroups.add(radio.name);
    });

    for (const group of radioGroups) {
        const checked = currentStepEl.querySelector(`input[name="${group}"]:checked`);
        if (!checked) {
            // Find the first radio in group to report validity
            const firstRadio = currentStepEl.querySelector(`input[name="${group}"]`);
            firstRadio.reportValidity();
            return false;
        }
    }

    return true;
}

function nextStep(step) {
    if (!validateStep(step)) return;

    document.getElementById(`step-${step}`).classList.remove('step-active');
    currentStep++;
    document.getElementById(`step-${currentStep}`).classList.add('step-active');
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    document.getElementById(`step-${step}`).classList.remove('step-active');
    currentStep--;
    document.getElementById(`step-${currentStep}`).classList.add('step-active');
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function submitForm() {
    if (!validateStep(3)) return;

    // Show loading
    document.getElementById('loading-overlay').classList.add('active');

    // Gather data
    const form = document.getElementById('survey-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Calculate Size Score (q1 + q2)
    let sizeScore = 0;
    const q1 = parseInt(data.q1);
    const q2Val = data.q2;
    const q2 = q2Val === '0_prefiero' ? 0 : parseInt(q2Val);
    
    sizeScore = q1 + q2;

    let sizeCategory = "";
    if (sizeScore <= 1) sizeCategory = "Empresa micro";
    else if (sizeScore <= 3) sizeCategory = "Empresa pequeña";
    else if (sizeScore <= 5) sizeCategory = "Empresa mediana";
    else sizeCategory = "Empresa grande";

    // Calculate Maturity Score (q3 to q11)
    let maturityScore = 0;
    for (let i = 3; i <= 11; i++) {
        maturityScore += parseInt(data[`q${i}`]);
    }

    // Determine Stage and Text
    let stageName = "";
    let stageIntro = "";
    let sizeSpecificText = "";
    let recommendedService = "";

    if (maturityScore <= 9) {
        stageName = "Etapa fundacional (0 - 9 puntos)";
        stageIntro = "La empresa opera en modo supervivencia. Todo depende de personas clave, sin procesos documentados ni métricas. Crecer en estas condiciones implica un riesgo operativo muy alto.";
        recommendedService = "Servicio de claridad y control. Primer paso para entender cómo funciona tu empresa hoy: números, decisiones y procesos. Sin plantillas genéricas.";
        
        if (sizeCategory === "Empresa micro") {
            sizeSpecificText = "Es común y esperable en esta etapa: recién estás armando las bases. El Diagnóstico Inicial te da el primer mapa antes de sumar estructura.";
        } else if (sizeCategory === "Empresa pequeña") {
            sizeSpecificText = "Ya tenés algo de escala pero la gestión no acompañó ese crecimiento. Es el momento de ordenar antes de que el caos se vuelva estructural.";
        } else if (sizeCategory === "Empresa mediana") {
            sizeSpecificText = "Con este tamaño, operar sin procesos documentados implica un riesgo alto: cada decisión importante depende de la memoria de las personas, no de datos.";
        } else {
            sizeSpecificText = "Es la combinación más urgente: una empresa grande gestionada de manera informal expone al negocio a errores costosos y difíciles de detectar a tiempo.";
        }
    } else if (maturityScore <= 18) {
        stageName = "Etapa de ordenamiento (10 - 18 puntos)";
        stageIntro = "Hay intuición de negocio, la empresa funciona , la gestión de tareas y el control es frágil y muy dependiente de algunas personas claves. El desafío es convertir ese saber en un sistema transferible y medible.";
        recommendedService = "Servicio de profesionalización y gestión integral. Diagnóstico para sentar la base, seguido de un informe mensual que convierte los datos de tu empresa en decisiones claras.";
        
        if (sizeCategory === "Empresa micro") {
            sizeSpecificText = "Es un buen momento para consolidar antes de crecer: instalar rutinas simples de seguimiento evita que el desorden escale junto con la empresa.";
        } else if (sizeCategory === "Empresa pequeña") {
            sizeSpecificText = "Tenés la escala justa para que un sistema de información marque una diferencia real en cómo se toman las decisiones del día a día.";
        } else if (sizeCategory === "Empresa mediana") {
            sizeSpecificText = "La brecha entre el tamaño de tu operación y la madurez de tu gestión empieza a generar fricción. Formalizar la información es el paso que sostiene el crecimiento ya logrado.";
        } else {
            sizeSpecificText = "En una empresa de este tamaño, seguir gestionando con indicadores informales limita cuánto podés delegar y escalar con seguridad.";
        }
    } else {
        stageName = "Etapa de consolidación / escala (19 - 27 puntos)";
        stageIntro = "Tenés estructura y métricas básicas, pero los objetivos estratégicos y el sistema de seguimiento todavía son informales. Hay un potencial importante sin aprovechar.";
        recommendedService = "Evolución Estratégico. Trabajo de fondo: capacitamos a tu equipo y construimos un sistema de gestión que tu empresa puede sostener sin depender de nosotras.";
        
        if (sizeCategory === "Empresa micro") {
            sizeSpecificText = "Estás gestionando con una madurez que muchas empresas más grandes no tienen. El desafío ahora es construir la estructura que sostenga ese nivel cuando el equipo crezca.";
        } else if (sizeCategory === "Empresa pequeña") {
            sizeSpecificText = "Tu gestión ya está lista para acompañar la siguiente etapa de crecimiento con un sistema formal, no solo con buena intuición.";
        } else if (sizeCategory === "Empresa mediana") {
            sizeSpecificText = "Es el perfil ideal para pasar de gestionar el día a día a conducir estratégicamente: definir visión, gobierno y objetivos de largo plazo.";
        } else {
            sizeSpecificText = "Con esta escala y esta madurez, el foco pasa a la gestión del crecimiento sostenido: gobierno corporativo, cultura y visión de largo plazo.";
        }
    }

    // Prepare Email template params
    const templateParams = {
        to_name: data.nombre,
        to_email: data.email,
        empresa_name: data.empresa,
        empresa_sector: data.sector,
        stage_name: stageName,
        stage_intro: stageIntro,
        size_category: sizeCategory,
        size_specific_text: sizeSpecificText,
        recommended_service: recommendedService
    };

    // To use EmailJS, you need a Service ID, Template ID and your Public Key.
    // Assuming the user configures EmailJS later, we simulate or send here.
    // You MUST create a template in EmailJS matching these variables (e.g. {{stage_intro}})
    
    emailjs.send('service_nch11cy', 'template_z20rrro', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showSuccess(data.email, sizeCategory, stageName);
        }, function(error) {
            console.log('FAILED...', error);
            // Even if it fails (due to missing keys), we show success for the demo flow
            alert("Nota: El envío de correo falló porque falta configurar las credenciales de EmailJS en el código. Pero el cálculo se realizó correctamente.");
            showSuccess(data.email, sizeCategory, stageName);
        });
}

function showSuccess(email, size, stage) {
    document.getElementById('loading-overlay').classList.remove('active');
    document.getElementById('step-3').classList.remove('step-active');
    document.getElementById('step-4').classList.add('step-active');
    document.getElementById('user-email-display').innerText = email;
    document.getElementById('res-size').innerText = size;
    document.getElementById('res-stage').innerText = stage;
    
    // Hide progress bar for final step
    document.querySelector('.progress-container').style.display = 'none';
}

// Initialize progress
updateProgress();
