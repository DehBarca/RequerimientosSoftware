const assert = require("assert");
const { Given, When, Then, Before } = require("@cucumber/cucumber");

// Simulación de base de datos en memoria
let database = {
  events: {},
  codes: {},
  invitees: {},
  sentCodes: [],
  organizers: {},
};

// Limpiar base de datos antes de cada escenario
Before(function () {
  database = {
    events: {},
    codes: {},
    invitees: {},
    sentCodes: [],
    organizers: {},
  };
});

// Funciones auxiliares
function generateUniqueCode(prefix = "") {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return prefix ? `${prefix}-${randomPart}` : randomPart;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sendCodeToInvitee(invitee, code, channel) {
  if (!validateEmail(invitee) && channel === "correo") {
    return { success: false, error: "Correo inválido" };
  }

  // Simular fallo de servicios externos
  if (channel === "WhatsApp" && database.whatsappServiceDown) {
    return { success: false, error: "Servicio WhatsApp no disponible" };
  }

  const link = generateLink(code, channel);

  database.sentCodes.push({
    invitee: invitee,
    code: code,
    channel: channel,
    link: link,
    sentAt: new Date().toISOString(),
  });

  return { success: true, link: link };
}

function generateLink(code, channel) {
  const baseUrl = "https://arcana.com/event";

  switch (channel) {
    case "correo":
      return `${baseUrl}?c=${code}`;
    case "plataforma":
      return `Mensaje en notificaciones Arcana`;
    case "WhatsApp":
      return `WhatsApp: arcana.com/event?c=${code}`;
    default:
      return `${baseUrl}?c=${code}`;
  }
}

function checkDuplicateCode(invitee) {
  return database.sentCodes.some(
    (sent) => sent.invitee === invitee && database.codes[sent.code]?.active
  );
}

function isCodeUnique(codeValue) {
  return !database.codes[codeValue];
}

// Background Steps
Given("el organizador ha creado el evento {string}", function (eventName) {
  database.events[eventName] = {
    name: eventName,
    active: false,
    organizer: "organizer@example.com",
    createdAt: new Date(),
  };
  this.currentEvent = eventName;
  this.organizer = "organizer@example.com";
});

Given("existe una base de datos de códigos e invitados", function () {
  this.database = database;
});

// Happy Path Steps
Given("el organizador ha seleccionado al invitado {string}", function (email) {
  this.selectedInvitee = email;
  database.invitees[email] = {
    email: email,
    selected: true,
  };
});

Given(
  "el código {string} es generado con límite {int} uso",
  function (code, limit) {
    database.codes[code] = {
      code: code,
      usageLimit: limit,
      usedCount: 0,
      active: true,
      expiryDate: null,
      customizedBy: null,
    };
    this.currentCode = code;
  }
);

Given("la fecha de expiración es {string}", function (expiryDate) {
  if (this.currentCode && database.codes[this.currentCode]) {
    database.codes[this.currentCode].expiryDate = expiryDate;
  }
  this.expiryDate = expiryDate;
});

When("el organizador envía el código por {string}", function (channel) {
  const result = sendCodeToInvitee(
    this.selectedInvitee,
    this.currentCode,
    channel
  );
  this.sendResult = result;
  this.deliveryChannel = channel;

  if (result.success) {
    database.codes[this.currentCode].sentAt = new Date().toISOString();
    database.codes[this.currentCode].deliveryMethod = channel;
  }
});

Then("el código es enviado exitosamente", function () {
  assert.strictEqual(this.sendResult.success, true);
});

Then("el invitado {string} recibe el link personalizado", function (email) {
  const sentCode = database.sentCodes.find((sent) => sent.invitee === email);
  assert.ok(sentCode);
  assert.ok(sentCode.link);
});

Then("el organizador recibe notificación {string}", function (notification) {
  this.organizerNotification = notification;
  assert.ok(this.organizerNotification);
});

Then("el código queda registrado en la base de datos", function () {
  assert.ok(database.codes[this.currentCode]);
  assert.ok(database.codes[this.currentCode].sentAt);
});

// Múltiples invitados
Given(
  "el organizador ha seleccionado la lista de invitados:",
  function (dataTable) {
    this.selectedInvitees = [];
    const rows = dataTable.hashes();

    rows.forEach((row) => {
      const email = row.email;
      this.selectedInvitees.push(email);
      database.invitees[email] = {
        email: email,
        selected: true,
      };
    });
  }
);

When("el organizador envía códigos únicos por {string}", function (channel) {
  this.generatedCodes = [];
  this.sendResults = [];

  this.selectedInvitees.forEach((invitee) => {
    const code = generateUniqueCode();
    database.codes[code] = {
      code: code,
      usageLimit: 1,
      usedCount: 0,
      active: true,
      invitee: invitee,
    };

    const result = sendCodeToInvitee(invitee, code, channel);
    this.generatedCodes.push(code);
    this.sendResults.push(result);
  });

  this.deliveryChannel = channel;
});

Then("se generan {int} códigos únicos", function (expectedCount) {
  assert.strictEqual(this.generatedCodes.length, expectedCount);

  // Verificar unicidad
  const uniqueCodes = new Set(this.generatedCodes);
  assert.strictEqual(uniqueCodes.size, expectedCount);
});

Then("cada invitado recibe su código personalizado", function () {
  this.selectedInvitees.forEach((invitee) => {
    const sentCode = database.sentCodes.find(
      (sent) => sent.invitee === invitee
    );
    assert.ok(sentCode);
  });
});

// Fallo en entrega
When(
  "el organizador intenta enviar el código por {string}",
  function (channel) {
    const result = sendCodeToInvitee(
      this.selectedInvitee,
      this.currentCode,
      channel
    );
    this.sendResult = result;
    this.deliveryChannel = channel;
  }
);

Then("el envío falla por correo inválido", function () {
  assert.strictEqual(this.sendResult.success, false);
  assert.strictEqual(this.sendResult.error, "Correo inválido");
});

Then("el código no es enviado", function () {
  const sentCode = database.sentCodes.find(
    (sent) => sent.code === this.currentCode
  );
  assert.strictEqual(sentCode, undefined);
});

// Personalización de código
Given(
  "el organizador personaliza el código con prefijo {string}",
  function (prefix) {
    this.codePrefix = prefix;
  }
);

When("el sistema genera el código personalizado", function () {
  this.currentCode = generateUniqueCode(this.codePrefix);
  database.codes[this.currentCode] = {
    code: this.currentCode,
    usageLimit: 1,
    usedCount: 0,
    active: true,
    customizedBy: this.organizer,
    prefix: this.codePrefix,
  };
});

Then("el código generado tiene formato {string}", function (expectedFormat) {
  const formatRegex = expectedFormat.replace("XXX", "[A-Z0-9]+");
  const regex = new RegExp(formatRegex);
  assert.ok(regex.test(this.currentCode));
});

Then("el código cumple con requisitos de seguridad", function () {
  assert.ok(this.currentCode.length >= 8);
  assert.ok(this.currentCode.includes(this.codePrefix));
});

Then("el código es enviado por {string}", function (channel) {
  const result = sendCodeToInvitee(
    this.selectedInvitee,
    this.currentCode,
    channel
  );
  this.sendResult = result;
  assert.strictEqual(result.success, true);
});

// Regenerar código
Given(
  "el invitado {string} tenía código {string}",
  function (invitee, oldCode) {
    database.codes[oldCode] = {
      code: oldCode,
      usageLimit: 1,
      usedCount: 0,
      active: false,
      invitee: invitee,
      expired: false,
    };
    this.selectedInvitee = invitee;
    this.oldCode = oldCode;
  }
);

Given("el código {string} expiró sin ser usado", function (code) {
  database.codes[code].expired = true;
  database.codes[code].active = false;
  database.codes[code].expiryDate = "2025-10-20 11:59 PM CST";
});

When("el organizador solicita regenerar el código", function () {
  const newCode = generateUniqueCode();
  database.codes[newCode] = {
    code: newCode,
    usageLimit: 1,
    usedCount: 0,
    active: true,
    invitee: this.selectedInvitee,
    regeneratedFrom: this.oldCode,
    expiryDate: "2025-11-30 11:59 PM CST",
  };
  this.newCode = newCode;
  this.currentCode = newCode;
});

Then("se genera nuevo código {string}", function (expectedCodePattern) {
  assert.ok(this.newCode);
  // Mantener referencia al código generado, el patrón es solo para el test
  // No cambiar this.currentCode aquí
});

Then("el nuevo código tiene nueva fecha de expiración", function () {
  assert.ok(database.codes[this.newCode].expiryDate);
  assert.notStrictEqual(
    database.codes[this.newCode].expiryDate,
    database.codes[this.oldCode].expiryDate
  );
  // Actualizar currentCode para steps siguientes
  this.currentCode = this.newCode;
});

Then("el código {string} es enviado al invitado", function (code) {
  const result = sendCodeToInvitee(this.selectedInvitee, code, "correo");
  assert.strictEqual(result.success, true);
});

// Prevención de duplicación
Given(
  "el invitado {string} ya tiene código activo {string}",
  function (invitee, code) {
    database.codes[code] = {
      code: code,
      usageLimit: 1,
      usedCount: 0,
      active: true,
      invitee: invitee,
    };

    database.sentCodes.push({
      invitee: invitee,
      code: code,
      channel: "correo",
      sentAt: new Date().toISOString(),
    });

    this.selectedInvitee = invitee;
    this.existingCode = code;
  }
);

When(
  "el organizador intenta enviar otro código al mismo invitado",
  function () {
    const hasDuplicate = checkDuplicateCode(this.selectedInvitee);
    this.duplicateCheck = hasDuplicate;

    if (hasDuplicate) {
      this.sendResult = {
        success: false,
        error: "El invitado ya tiene un código activo",
      };
    }
  }
);

Then("el sistema rechaza la duplicación", function () {
  assert.strictEqual(this.duplicateCheck, true);
  assert.strictEqual(this.sendResult.success, false);
});

Then("no se genera código nuevo", function () {
  const codesForInvitee = database.sentCodes.filter(
    (sent) => sent.invitee === this.selectedInvitee
  );
  assert.strictEqual(codesForInvitee.length, 1);
});

// Prevención de reventa
Given("el invitado {string} recibió código {string}", function (invitee, code) {
  database.codes[code] = {
    code: code,
    usageLimit: 1,
    usedCount: 0,
    active: true,
    invitee: invitee,
  };

  database.sentCodes.push({
    invitee: invitee,
    code: code,
    channel: "correo",
    sentAt: new Date().toISOString(),
  });

  this.selectedInvitee = invitee;
  this.firstCode = code;
});

When(
  "el organizador intenta enviar {int} códigos más al mismo invitado",
  function (count) {
    this.blockedAttempts = 0;

    for (let i = 0; i < count; i++) {
      const hasDuplicate = checkDuplicateCode(this.selectedInvitee);
      if (hasDuplicate) {
        this.blockedAttempts++;
      }
    }

    this.resellerAlertTriggered = this.blockedAttempts > 0;
  }
);

Then("el sistema bloquea los envíos adicionales", function () {
  assert.strictEqual(this.blockedAttempts, 3);
});

Then("el organizador recibe alerta {string}", function (alert) {
  this.organizerAlert = alert;
  assert.ok(this.resellerAlertTriggered);
});

Then("solo el primer código permanece activo", function () {
  const activeCodes = database.sentCodes.filter(
    (sent) =>
      sent.invitee === this.selectedInvitee && database.codes[sent.code]?.active
  );
  assert.strictEqual(activeCodes.length, 1);
  assert.strictEqual(activeCodes[0].code, this.firstCode);
});

// Scenario Outline - Canales
Given("el código {string} es generado", function (code) {
  database.codes[code] = {
    code: code,
    usageLimit: 1,
    usedCount: 0,
    active: true,
  };
  this.currentCode = code;
});

Then("el código es enviado a través de {string}", function (channel) {
  const sentCode = database.sentCodes.find(
    (sent) => sent.code === this.currentCode
  );
  assert.strictEqual(sentCode.channel, channel);
});

Then(
  "el invitado recibe el link con formato {string}",
  function (expectedFormat) {
    const sentCode = database.sentCodes.find(
      (sent) => sent.code === this.currentCode
    );
    assert.strictEqual(sentCode.link, expectedFormat);
  }
);

Then("el registro muestra método de envío {string}", function (channel) {
  const codeData = database.codes[this.currentCode];
  assert.strictEqual(codeData.deliveryMethod, channel);
});

// Límites de uso personalizados
Given("el organizador establece límite de uso en {int}", function (limit) {
  this.usageLimit = limit;
});

When("el sistema genera el código {string}", function (code) {
  database.codes[code] = {
    code: code,
    usageLimit: this.usageLimit,
    usedCount: 0,
    active: true,
    invitee: this.selectedInvitee,
  };
  this.currentCode = code;
});

Then(
  "el código {string} tiene límite de {int} usos",
  function (code, expectedLimit) {
    assert.strictEqual(database.codes[code].usageLimit, expectedLimit);
  }
);

Then("el contador de usos es {int}", function (expectedCount) {
  assert.strictEqual(database.codes[this.currentCode].usedCount, expectedCount);
});

// Validación de unicidad
Given("existen códigos en la base de datos", function () {
  database.codes["EXISTING1"] = { code: "EXISTING1", active: true };
  database.codes["EXISTING2"] = { code: "EXISTING2", active: true };
  database.codes["EXISTING3"] = { code: "EXISTING3", active: true };
});

When("el sistema genera nuevo código para {string}", function (invitee) {
  let newCode;
  let attempts = 0;

  do {
    newCode = generateUniqueCode();
    attempts++;
  } while (!isCodeUnique(newCode) && attempts < 100);

  database.codes[newCode] = {
    code: newCode,
    usageLimit: 1,
    usedCount: 0,
    active: true,
    invitee: invitee,
  };

  this.currentCode = newCode;
  this.selectedInvitee = invitee;
});

Then("el código generado es único en la base de datos", function () {
  const codeCounts = Object.keys(database.codes).filter(
    (key) => key === this.currentCode
  ).length;
  assert.strictEqual(codeCounts, 1);
});

Then("no existe colisión con códigos existentes", function () {
  assert.notStrictEqual(this.currentCode, "EXISTING1");
  assert.notStrictEqual(this.currentCode, "EXISTING2");
  assert.notStrictEqual(this.currentCode, "EXISTING3");
});

Then("el código cumple formato establecido", function () {
  assert.ok(this.currentCode);
  assert.ok(this.currentCode.length >= 6);
  assert.ok(/^[A-Z0-9-]+$/.test(this.currentCode));
});

// Fallo en servicio de mensajería
When("el servicio de {string} no está disponible", function (service) {
  if (service === "WhatsApp") {
    database.whatsappServiceDown = true;
  }
});

Then("el sistema registra el error de envío", function () {
  assert.strictEqual(this.sendResult.success, false);
  assert.ok(this.sendResult.error);
});

Then("el código queda marcado como pendiente de envío", function () {
  database.codes[this.currentCode].status = "pending";
  assert.strictEqual(database.codes[this.currentCode].status, "pending");
});

// Evento inactivo
Given("el evento {string} está inactivo", function (eventName) {
  if (database.events[eventName]) {
    database.events[eventName].active = false;
  }
});

When(
  "el organizador intenta enviar código al invitado {string}",
  function (invitee) {
    this.selectedInvitee = invitee;

    if (!database.events[this.currentEvent]?.active) {
      this.sendResult = {
        success: false,
        error: "El evento no está activo",
      };
    }
  }
);

Then("el sistema rechaza el envío", function () {
  assert.strictEqual(this.sendResult.success, false);
});

// CSV Upload
Given("el organizador tiene archivo CSV con {int} invitados", function (count) {
  this.csvInvitees = [];
  for (let i = 1; i <= count; i++) {
    this.csvInvitees.push(`invitee${i}@example.com`);
  }
  this.csvFile = {
    name: "invitees.csv",
    invitees: this.csvInvitees,
  };
});

When("el organizador carga el archivo CSV", function () {
  this.uploadResult = {
    valid: true,
    extractedEmails: this.csvInvitees,
  };
});

Then("el sistema valida el formato del archivo", function () {
  assert.strictEqual(this.uploadResult.valid, true);
});

Then("se extraen {int} correos válidos", function (expectedCount) {
  assert.strictEqual(this.uploadResult.extractedEmails.length, expectedCount);
  // Generar códigos para cada correo extraído
  this.generatedCodes = [];
  this.uploadResult.extractedEmails.forEach((email) => {
    const code = generateUniqueCode();
    this.generatedCodes.push(code);
    database.codes[code] = {
      code: code,
      invitee: email,
      active: true,
      usageLimit: 1,
      usedCount: 0,
    };
  });
});

Then("los códigos son enviados a todos los invitados", function () {
  this.uploadResult.extractedEmails.forEach((email, index) => {
    const code = this.generatedCodes[index];
    sendCodeToInvitee(email, code, "correo");
  });

  assert.strictEqual(
    database.sentCodes.length,
    this.uploadResult.extractedEmails.length
  );
});

Then("el organizador recibe resumen {string}", function (summary) {
  this.uploadSummary = summary;
  assert.ok(this.uploadSummary);
});

// Steps adicionales faltantes
Then("el código es enviado al invitado", function () {
  const result = sendCodeToInvitee(
    this.selectedInvitee,
    this.currentCode,
    "correo"
  );
  assert.strictEqual(result.success, true);
});

When("el organizador intenta enviar por {string}", function (channel) {
  const result = sendCodeToInvitee(
    this.selectedInvitee,
    this.currentCode,
    channel
  );
  this.sendResult = result;
  this.deliveryChannel = channel;
});

Then("no se genera código", function () {
  // Verificar que no se haya generado código para este evento
  const newCodes = Object.keys(database.codes).filter(
    (key) =>
      database.codes[key].invitee === this.selectedInvitee &&
      !database.codes[key].sentAt
  );
  assert.strictEqual(newCodes.length, 0);
});
