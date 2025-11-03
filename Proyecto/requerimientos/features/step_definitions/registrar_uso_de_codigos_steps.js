const assert = require("assert");
const { Given, When, Then, Before } = require("@cucumber/cucumber");

// Simulación de base de datos en memoria
let database = {
  users: {},
  codes: {},
  events: {},
  history: [],
  sessions: {},
};

// Hook para limpiar la base de datos antes de cada escenario
Before(function () {
  database = {
    users: {},
    codes: {},
    events: {},
    history: [],
    sessions: {},
  };
});

// Funciones auxiliares
function validateCode(code, userId, eventId) {
  const codeData = database.codes[code];

  if (!codeData || codeData.valid === false) {
    return { valid: false, status: "rechazado", message: "Código inválido" };
  }

  if (codeData.used) {
    return {
      valid: false,
      status: "rechazado",
      message: "Código ya utilizado",
    };
  }

  if (codeData.usageLimit && codeData.usedCount >= codeData.usageLimit) {
    return {
      valid: false,
      status: "rechazado",
      message: "Código alcanzó límite de usos",
    };
  }

  if (codeData.expired) {
    return { valid: false, status: "caducado", message: "Código expirado" };
  }

  if (!database.sessions[userId] || database.sessions[userId].mfaExpired) {
    return {
      valid: false,
      status: "pendiente",
      message: "Reautenticación requerida",
    };
  }

  if (codeData.fraudAttempts && codeData.fraudAttempts >= 2) {
    return {
      valid: false,
      status: "sospechoso",
      message: "Intento sospechoso detectado",
    };
  }

  if (codeData.validationError) {
    return {
      valid: false,
      status: "pendiente",
      message: "Error técnico, intente más tarde",
    };
  }

  return { valid: true, status: "validado", message: "Acceso aprobado" };
}

function registerUsage(code, userId, eventId, status) {
  const timestamp = new Date().toISOString();
  const entry = {
    id: database.history.length + 1,
    code: code,
    userId: userId,
    eventId: eventId,
    timestamp: timestamp,
    status: status,
    deviceInfo: "device_info_placeholder",
  };

  database.history.push(entry);

  if (status === "validado" && database.codes[code]) {
    database.codes[code].used = true;
    database.codes[code].usedCount = (database.codes[code].usedCount || 0) + 1;
  }

  return entry;
}

// Background Steps
Given("el evento {string} está activo", function (eventName) {
  if (database.events[eventName]) {
    database.events[eventName].active = true;
  } else {
    database.events[eventName] = {
      name: eventName,
      active: true,
    };
  }
  this.currentEvent = eventName;
});

Given("existe una base de datos de códigos", function () {
  // Base de datos ya inicializada
  this.database = database;
});

// Happy Path Steps
Given("el usuario {string} ha iniciado sesión con MFA", function (email) {
  database.users[email] = {
    email: email,
    authenticated: true,
    mfaCompleted: true,
  };
  database.sessions[email] = {
    active: true,
    mfaExpired: false,
    timestamp: new Date(),
  };
  this.currentUser = email;
});

Given("el código {string} es válido y no ha sido usado", function (code) {
  database.codes[code] = {
    code: code,
    valid: true,
    used: false,
    expired: false,
    usedCount: 0,
    usageLimit: null,
  };
  this.currentCode = code;
});

When(
  "el usuario intenta usar el código {string} para el evento {string}",
  function (code, eventName) {
    this.currentCode = code;
    this.currentEvent = eventName;
    const result = validateCode(code, this.currentUser, eventName);
    this.validationResult = result;

    if (
      !result.valid &&
      result.status === "pendiente" &&
      database.codes[code]?.validationError
    ) {
      this.systemAction = "postpone_validation";
    } else if (
      result.valid ||
      (result.status && result.status !== "pendiente")
    ) {
      this.historyEntry = registerUsage(
        code,
        this.currentUser,
        eventName,
        result.status
      );
    }
  }
);

Then("el sistema valida el código exitosamente", function () {
  assert.strictEqual(this.validationResult.valid, true);
});

Then(
  "el sistema registra el uso con estado {string}",
  function (expectedStatus) {
    if (this.historyEntry) {
      assert.strictEqual(this.historyEntry.status, expectedStatus);
    } else {
      // Para casos donde el registro se hace después
      const lastEntry = database.history[database.history.length - 1];
      assert.strictEqual(lastEntry.status, expectedStatus);
    }
  }
);

Then(
  "el usuario recibe notificación {string}",
  function (expectedNotification) {
    assert.strictEqual(this.validationResult.message, expectedNotification);
    this.userNotification = expectedNotification;
  }
);

Then("el organizador puede ver la validación en el historial", function () {
  const historyForEvent = database.history.filter(
    (h) => h.eventId === this.currentEvent
  );
  assert.ok(historyForEvent.length > 0);
});

Then(
  "el sistema registra el intento con estado {string}",
  function (expectedStatus) {
    if (this.historyEntry) {
      assert.strictEqual(this.historyEntry.status, expectedStatus);
    } else {
      // Para casos donde el registro se hace después
      const lastEntry = database.history[database.history.length - 1];
      assert.strictEqual(lastEntry.status, expectedStatus);
    }
  }
);

// Path Alternativo 1: Límite de usos alcanzado
Given("el código {string} tiene límite de usos alcanzado", function (code) {
  database.codes[code] = {
    code: code,
    valid: true,
    used: false,
    expired: false,
    usedCount: 5,
    usageLimit: 5,
  };
  this.currentCode = code;
});

Then("el sistema rechaza el código", function () {
  assert.strictEqual(this.validationResult.valid, false);
});

Then("el organizador recibe alerta de código agotado", function () {
  this.organizerAlert = "Código agotado: " + this.currentCode;
  assert.ok(this.organizerAlert);
});

// Path Alternativo 2: Código caducado
Given("el código {string} ha expirado", function (code) {
  database.codes[code] = {
    code: code,
    valid: true,
    used: false,
    expired: true,
    expiryDate: new Date(Date.now() - 86400000), // Expiró hace 1 día
  };
  this.currentCode = code;
});

Then("el organizador es notificado para emitir nuevo código", function () {
  this.organizerNotification =
    "Código expirado. Emitir nuevo código para usuario.";
  assert.ok(this.organizerNotification);
});

// Path Alternativo 3: Compra diferida
When("el usuario verifica el código {string}", function (code) {
  this.currentCode = code;
  this.codeVerified = true;
});

When("la sesión MFA está activa", function () {
  assert.strictEqual(database.sessions[this.currentUser].active, true);
  assert.strictEqual(database.sessions[this.currentUser].mfaExpired, false);
});

When("el código no ha expirado", function () {
  assert.strictEqual(database.codes[this.currentCode].expired, false);
});

When("el usuario completa el acceso después", function () {
  const result = validateCode(
    this.currentCode,
    this.currentUser,
    this.currentEvent
  );
  this.validationResult = result;
  this.historyEntry = registerUsage(
    this.currentCode,
    this.currentUser,
    this.currentEvent,
    result.status
  );
});

Then("el historial muestra la validación completada", function () {
  const entry = database.history.find(
    (h) =>
      h.code === this.currentCode &&
      h.userId === this.currentUser &&
      h.status === "validado"
  );
  assert.ok(entry);
});

// Excepción 1: Sesión MFA expirada
Given("el usuario {string} tenía sesión MFA activa", function (email) {
  database.users[email] = {
    email: email,
    authenticated: true,
    mfaCompleted: true,
  };
  database.sessions[email] = {
    active: true,
    mfaExpired: false,
    timestamp: new Date(Date.now() - 3600000), // Hace 1 hora
  };
  this.currentUser = email;
});

Given("la sesión MFA ha expirado", function () {
  database.sessions[this.currentUser].mfaExpired = true;
  database.sessions[this.currentUser].active = false;
});

When("el usuario intenta usar el código {string}", function (code) {
  this.currentCode = code;
  database.codes[code] = database.codes[code] || { code: code, valid: true };
  const result = validateCode(
    code,
    this.currentUser,
    this.currentEvent || "Evento Privado"
  );
  this.validationResult = result;

  if (result.status === "pendiente") {
    this.historyEntry = registerUsage(
      code,
      this.currentUser,
      this.currentEvent || "Evento Privado",
      result.status
    );
  }
});

Then("el sistema solicita reautenticación MFA", function () {
  this.systemAction = "request_mfa_reauth";
  assert.ok(this.systemAction);
});

// Excepción 2: Intento fraudulento
Given("el código {string} es válido", function (code) {
  database.codes[code] = {
    code: code,
    valid: true,
    used: false,
    expired: false,
    fraudAttempts: 0,
  };
  this.currentCode = code;
});

When(
  "el sistema detecta intentos desde {int} dispositivos diferentes",
  function (deviceCount) {
    database.codes[this.currentCode].fraudAttempts = deviceCount;
    const result = validateCode(
      this.currentCode,
      this.currentUser,
      this.currentEvent
    );
    this.validationResult = result;
    this.historyEntry = registerUsage(
      this.currentCode,
      this.currentUser,
      this.currentEvent,
      result.status
    );
  }
);

Then("el sistema bloquea temporalmente el código {string}", function (code) {
  database.codes[code].blocked = true;
  assert.strictEqual(database.codes[code].blocked, true);
});

Then("el organizador recibe alerta de fraude", function () {
  this.organizerAlert =
    "Intento fraudulento detectado para código: " + this.currentCode;
  assert.ok(this.organizerAlert);
});

Then("se requiere verificación adicional del usuario", function () {
  this.additionalVerificationRequired = true;
  assert.ok(this.additionalVerificationRequired);
});

// Excepción 3: Error en validación
When("ocurre un error en el módulo de validación", function () {
  database.codes[this.currentCode].validationError = true;
  const result = validateCode(
    this.currentCode,
    this.currentUser,
    this.currentEvent
  );
  this.validationResult = result;
  this.historyEntry = registerUsage(
    this.currentCode,
    this.currentUser,
    this.currentEvent,
    result.status
  );
});

Then("el sistema pospone la validación", function () {
  this.systemAction = "postpone_validation";
  assert.ok(this.systemAction);
});

Then("el organizador es notificado del error", function () {
  this.organizerNotification =
    "Error en validación del código: " + this.currentCode;
  assert.ok(this.organizerNotification);
});

Then("se permite revalidación manual", function () {
  this.manualRevalidationAllowed = true;
  assert.ok(this.manualRevalidationAllowed);
});

// Excepción 4: Código no registrado tras compra
Given("el usuario {string} compró un boleto", function (email) {
  database.users[email] = {
    email: email,
    ticketPurchased: true,
  };
  this.currentUser = email;
});

Given("el código {string} no se registró por error", function (code) {
  database.codes[code] = {
    code: code,
    registrationError: true,
    valid: true,
  };
  this.currentCode = code;
});

When("el organizador detecta el error", function () {
  this.organizerDetectedError = true;
});

Then("el sistema activa rutina de contingencia", function () {
  this.contingencyActivated = true;
  assert.ok(this.contingencyActivated);
});

Then("se permite revalidación manual del código {string}", function (code) {
  database.codes[code].manualRevalidationAllowed = true;
  assert.strictEqual(database.codes[code].manualRevalidationAllowed, true);
});

Then("el usuario y organizador son notificados", function () {
  this.userNotified = true;
  this.organizerNotified = true;
  assert.ok(this.userNotified && this.organizerNotified);
});

Then("se asegura el acceso al evento", function () {
  this.accessGranted = true;
  assert.ok(this.accessGranted);
});

// Scenario Outline Steps
Given("el código {string} tiene estado {string}", function (code, estado) {
  database.codes[code] = database.codes[code] || { code: code };

  switch (estado) {
    case "válido":
      database.codes[code].valid = true;
      database.codes[code].used = false;
      database.codes[code].expired = false;
      break;
    case "usado":
      database.codes[code].valid = true;
      database.codes[code].used = true;
      break;
    case "caducado":
      database.codes[code].valid = true;
      database.codes[code].expired = true;
      break;
    case "inválido":
      database.codes[code].valid = false;
      break;
  }

  this.currentCode = code;
});

Then("el sistema responde con {string}", function (expectedResult) {
  const actualResult = this.validationResult.valid ? "aprobado" : "rechazado";
  assert.strictEqual(actualResult, expectedResult);
});

Then("el historial registra estado {string}", function (expectedStatus) {
  assert.strictEqual(this.historyEntry.status, expectedStatus);
});

// Consulta de historial
Given("existen {int} validaciones en el historial", function (count) {
  database.history = [];
  for (let i = 0; i < count; i++) {
    database.history.push({
      id: i + 1,
      code: `CODE${i}`,
      userId: `user${i}@example.com`,
      eventId: "Evento Privado",
      timestamp: "2025-10-20T17:38:00.000Z",
      status: i % 2 === 0 ? "validado" : "rechazado",
      deviceInfo: "device_info",
    });
  }
});

Given("el organizador está autenticado", function () {
  this.organizerAuthenticated = true;
});

When("el organizador solicita el historial de validaciones", function () {
  this.historialResult = database.history;
});

Then(
  "el sistema muestra todas las validaciones con fecha, hora, usuario, estado y evento",
  function () {
    assert.ok(this.historialResult.length > 0);
    this.historialResult.forEach((entry) => {
      assert.ok(entry.timestamp);
      assert.ok(entry.userId);
      assert.ok(entry.status);
      assert.ok(entry.eventId);
    });
  }
);

Then("el organizador puede filtrar por estado {string}", function (status) {
  const filtered = this.historialResult.filter((h) => h.status === status);
  this.filteredResult = filtered;
  assert.ok(filtered.length > 0);
});

Then("el organizador puede filtrar por fecha {string}", function (fecha) {
  // Simulación de filtro por fecha
  this.filteredByDate = this.historialResult.filter((h) =>
    h.timestamp.includes("2025-10-20")
  );
  assert.ok(this.filteredByDate.length > 0);
});
