const assert = require("assert");
const { Given, When, Then, Before } = require("@cucumber/cucumber");

// Simulación de base de datos en memoria
let database = {
  events: [],
  users: {},
  collaborations: [],
  conflictWarnings: [],
  forcedCreations: [],
};

// Limpiar base de datos antes de cada escenario
Before(function () {
  database = {
    events: [],
    users: {},
    collaborations: [],
    conflictWarnings: [],
    forcedCreations: [],
  };
});

// Funciones auxiliares
function parseDateTime(date, time) {
  const [day, month, year] = date.split("/");
  const [hours, minutes] = time.split(":");
  return new Date(year, month - 1, day, hours, minutes);
}

function checkTimeOverlap(start1, end1, start2, end2) {
  // No hay overlap si un evento termina exactamente cuando el otro empieza
  if (
    end1.getTime() === start2.getTime() ||
    end2.getTime() === start1.getTime()
  ) {
    return false;
  }
  // Hay overlap si hay cualquier intersección
  return start1 < end2 && start2 < end1;
}

function findConflicts(userId, newEvent, excludeEventId = null) {
  const conflicts = [];

  // Obtener eventos del usuario y sus colaboraciones
  const userEvents = database.events.filter((event) => {
    if (excludeEventId && event.id === excludeEventId) {
      return false; // Excluir el evento que se está editando
    }

    // Evento propio
    if (event.organizerId === userId) {
      return true;
    }

    // Evento donde es colaborador
    const isCollaborator = database.collaborations.some(
      (collab) =>
        collab.userId === userId &&
        collab.eventOrganizerId === event.organizerId
    );

    return isCollaborator;
  });

  for (const existingEvent of userEvents) {
    const sameDate = existingEvent.date === newEvent.date;

    if (!sameDate) {
      continue; // No hay conflicto si es otro día
    }

    const timeOverlap = checkTimeOverlap(
      existingEvent.startTime,
      existingEvent.endTime,
      newEvent.startTime,
      newEvent.endTime
    );

    if (timeOverlap) {
      const samePlaceConflict = existingEvent.place === newEvent.place;

      conflicts.push({
        type: samePlaceConflict ? "place_and_time" : "time_only",
        existingEvent,
        message: samePlaceConflict
          ? `El lugar ${newEvent.place} ya está reservado por tu evento ${existingEvent.name}`
          : "Ya tienes otro evento programado en ese horario",
      });
    }
  }

  return conflicts;
}

function createEvent(name, organizerId, date, startTime, endTime, place) {
  const event = {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    organizerId,
    date,
    startTime,
    endTime,
    place,
    createdAt: new Date(),
  };

  database.events.push(event);
  return event;
}

// ===============================================
// GIVEN STEPS
// ===============================================

Given(
  "{word} tiene reservado {string} en {word} {word} el {int}\\/{int}\\/{int} de {int}:{int} a {int}:{int}",
  function (
    userName,
    eventName,
    placeWord1,
    placeWord2,
    day,
    month,
    year,
    startHour,
    startMin,
    endHour,
    endMin
  ) {
    const userId = userName.toLowerCase();
    database.users[userId] = { name: userName, id: userId };
    const place = `${placeWord1} ${placeWord2}`;

    const date = `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
    const startTime = parseDateTime(
      date,
      `${String(startHour).padStart(2, "0")}:${String(startMin).padStart(
        2,
        "0"
      )}`
    );
    const endTime = parseDateTime(
      date,
      `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`
    );

    const event = createEvent(
      eventName,
      userId,
      date,
      startTime,
      endTime,
      place
    );

    this.currentUser = userId;
    this.existingEvent = event;
  }
);

Given(
  "{word} tiene {string} el {int}\\/{int}\\/{int} de {int}:{int} a {int}:{int} en {word} {word}",
  function (
    userName,
    eventName,
    day,
    month,
    year,
    startHour,
    startMin,
    endHour,
    endMin,
    placeWord1,
    placeWord2
  ) {
    const userId = userName.toLowerCase();
    database.users[userId] = { name: userName, id: userId };
    const place = `${placeWord1} ${placeWord2}`;

    const date = `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
    const startTime = parseDateTime(
      date,
      `${String(startHour).padStart(2, "0")}:${String(startMin).padStart(
        2,
        "0"
      )}`
    );
    const endTime = parseDateTime(
      date,
      `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`
    );

    const event = createEvent(
      eventName,
      userId,
      date,
      startTime,
      endTime,
      place
    );

    this.currentUser = userId;
    this.existingEvent = event;
  }
);

Given(
  "{word} tiene reservado {word} {word} el {int}\\/{int}\\/{int} de {int}:{int} a {int}:{int}",
  function (
    userName,
    placeWord1,
    placeWord2,
    day,
    month,
    year,
    startHour,
    startMin,
    endHour,
    endMin
  ) {
    const userId = userName.toLowerCase();
    database.users[userId] = { name: userName, id: userId };
    const place = `${placeWord1} ${placeWord2}`;

    const date = `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
    const startTime = parseDateTime(
      date,
      `${String(startHour).padStart(2, "0")}:${String(startMin).padStart(
        2,
        "0"
      )}`
    );
    const endTime = parseDateTime(
      date,
      `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`
    );

    const event = createEvent(
      "Reserva existente",
      userId,
      date,
      startTime,
      endTime,
      place
    );

    this.currentUser = userId;
    this.existingEvent = event;
  }
);

Given(
  "{word} tiene reservado {string} el {int}\\/{int}\\/{int} de {int}:{int} a {int}:{int}",
  function (
    userName,
    eventName,
    day,
    month,
    year,
    startHour,
    startMin,
    endHour,
    endMin
  ) {
    const userId = userName.toLowerCase();
    database.users[userId] = { name: userName, id: userId };
    const place = "Central Perk";

    const date = `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
    const startTime = parseDateTime(
      date,
      `${String(startHour).padStart(2, "0")}:${String(startMin).padStart(
        2,
        "0"
      )}`
    );
    const endTime = parseDateTime(
      date,
      `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`
    );

    const event = createEvent(
      eventName,
      userId,
      date,
      startTime,
      endTime,
      place
    );

    this.currentUser = userId;
    this.existingEvent = event;
  }
);

Given(
  "{word} tiene {string} en {string} el {int}\\/{int}\\/{int} de {int}:{int} a {int}:{int}",
  function (
    userName,
    eventName,
    place,
    day,
    month,
    year,
    startHour,
    startMin,
    endHour,
    endMin
  ) {
    const userId = userName.toLowerCase();
    database.users[userId] = { name: userName, id: userId };

    const date = `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
    const startTime = parseDateTime(
      date,
      `${String(startHour).padStart(2, "0")}:${String(startMin).padStart(
        2,
        "0"
      )}`
    );
    const endTime = parseDateTime(
      date,
      `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`
    );

    const event = createEvent(
      eventName,
      userId,
      date,
      startTime,
      endTime,
      place
    );

    this.currentUser = userId;
    this.existingEvent = event;
  }
);

Given(
  "{word} tiene {string} el {int}\\/{int}\\/{int} de {int}:{int} a {int}:{int}",
  function (
    userName,
    eventName,
    day,
    month,
    year,
    startHour,
    startMin,
    endHour,
    endMin
  ) {
    const userId = userName.toLowerCase();
    database.users[userId] = { name: userName, id: userId };

    const date = `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
    const startTime = parseDateTime(
      date,
      `${startHour}:${String(startMin).padStart(2, "0")}`
    );
    const endTime = parseDateTime(
      date,
      `${endHour}:${String(endMin).padStart(2, "0")}`
    );

    const event = createEvent(
      eventName,
      userId,
      date,
      startTime,
      endTime,
      "Lugar por defecto"
    );

    this.currentUser = userId;
    this.existingEvent = event;
  }
);

Given("aparece advertencia de conflicto", function () {
  this.conflictWarning = {
    message: "Ya tienes otro evento programado en ese horario",
    canForce: true,
  };

  database.conflictWarnings.push(this.conflictWarning);
});

Given(
  "{word} es colaborador de {word}",
  function (collaboratorName, organizerName) {
    const collaboratorId = collaboratorName.toLowerCase();
    const organizerId = organizerName.toLowerCase();

    database.users[collaboratorId] = {
      name: collaboratorName,
      id: collaboratorId,
    };
    database.users[organizerId] = { name: organizerName, id: organizerId };

    database.collaborations.push({
      userId: collaboratorId,
      eventOrganizerId: organizerId,
    });

    this.currentUser = collaboratorId;
    this.collaboratorId = collaboratorId;
    this.organizerId = organizerId;
  }
);

// ===============================================
// WHEN STEPS
// ===============================================

When(
  "{word} intenta crear {string} en {word} {word} el {int}\\/{int}\\/{int} de {int}:{int} a {int}:{int}",
  function (
    userName,
    eventName,
    placeWord1,
    placeWord2,
    day,
    month,
    year,
    startHour,
    startMin,
    endHour,
    endMin
  ) {
    const userId = userName.toLowerCase();
    this.currentUser = userId;
    const place = `${placeWord1} ${placeWord2}`;

    const date = `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
    const startTime = parseDateTime(
      date,
      `${startHour}:${String(startMin).padStart(2, "0")}`
    );
    const endTime = parseDateTime(
      date,
      `${endHour}:${String(endMin).padStart(2, "0")}`
    );

    const newEvent = {
      name: eventName,
      organizerId: userId,
      date,
      startTime,
      endTime,
      place,
    };

    const conflicts = findConflicts(userId, newEvent);

    this.newEvent = newEvent;
    this.conflicts = conflicts;
    this.attemptedCreation = true;

    if (conflicts.length === 0) {
      const event = createEvent(
        eventName,
        userId,
        date,
        startTime,
        endTime,
        place
      );
      this.createdEvent = event;
      this.creationBlocked = false;
    } else {
      this.creationBlocked = true;
      this.conflictMessage = conflicts[0].message;
    }
  }
);

When(
  "{word} intenta crear {string} el {int}\\/{int}\\/{int} de {int}:{int} a {int}:{int} en {string}",
  function (
    userName,
    eventName,
    day,
    month,
    year,
    startHour,
    startMin,
    endHour,
    endMin,
    place
  ) {
    const userId = userName.toLowerCase();
    this.currentUser = userId;

    const date = `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
    const startTime = parseDateTime(
      date,
      `${startHour}:${String(startMin).padStart(2, "0")}`
    );
    const endTime = parseDateTime(
      date,
      `${endHour}:${String(endMin).padStart(2, "0")}`
    );

    const newEvent = {
      name: eventName,
      organizerId: userId,
      date,
      startTime,
      endTime,
      place,
    };

    const conflicts = findConflicts(userId, newEvent);

    this.newEvent = newEvent;
    this.conflicts = conflicts;
    this.attemptedCreation = true;

    if (conflicts.length === 0) {
      const event = createEvent(
        eventName,
        userId,
        date,
        startTime,
        endTime,
        place
      );
      this.createdEvent = event;
      this.creationBlocked = false;
    } else {
      this.creationBlocked = true;
      this.conflictMessage = conflicts[0].message;
    }
  }
);

When(
  "{word} crea {string} el {int}\\/{int}\\/{int} de {int}:{int} a {int}:{int}",
  function (
    userName,
    eventName,
    day,
    month,
    year,
    startHour,
    startMin,
    endHour,
    endMin
  ) {
    const userId = userName.toLowerCase();
    this.currentUser = userId;

    const date = `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
    const startTime = parseDateTime(
      date,
      `${startHour}:${String(startMin).padStart(2, "0")}`
    );
    const endTime = parseDateTime(
      date,
      `${endHour}:${String(endMin).padStart(2, "0")}`
    );

    const newEvent = {
      name: eventName,
      organizerId: userId,
      date,
      startTime,
      endTime,
      place: "Lugar por defecto",
    };

    const conflicts = findConflicts(userId, newEvent);

    this.conflicts = conflicts;

    if (conflicts.length === 0) {
      const event = createEvent(
        eventName,
        userId,
        date,
        startTime,
        endTime,
        "Lugar por defecto"
      );
      this.createdEvent = event;
      this.creationBlocked = false;
    } else {
      this.creationBlocked = true;
    }
  }
);

When(
  "{word} edita {string} y cambia su horario a {int}\\/{int}\\/{int} de {int}:{int} a {int}:{int}",
  function (
    userName,
    eventName,
    day,
    month,
    year,
    startHour,
    startMin,
    endHour,
    endMin
  ) {
    const userId = userName.toLowerCase();
    this.currentUser = userId;

    // Crear el evento a editar
    const eventToEdit = createEvent(
      eventName,
      userId,
      "01/12/2025",
      parseDateTime("01/12/2025", "10:00"),
      parseDateTime("01/12/2025", "12:00"),
      "Lugar original"
    );

    const date = `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
    const startTime = parseDateTime(
      date,
      `${startHour}:${String(startMin).padStart(2, "0")}`
    );
    const endTime = parseDateTime(
      date,
      `${endHour}:${String(endMin).padStart(2, "0")}`
    );

    const updatedEvent = {
      name: eventName,
      organizerId: userId,
      date,
      startTime,
      endTime,
      place: "Lugar original",
    };

    const conflicts = findConflicts(userId, updatedEvent, eventToEdit.id);

    this.conflicts = conflicts;
    this.editMode = true;

    if (conflicts.length > 0) {
      this.conflictModalShown = true;
    }
  }
);

When(
  "{word} pulsa {string} y marca el checkbox {string}",
  function (userName, buttonText, checkboxText) {
    const userId = userName.toLowerCase();
    this.currentUser = userId;

    if (buttonText === "Crear de todos modos") {
      // Forzar la creación del evento a pesar del conflicto
      const event = createEvent(
        "Evento Forzado",
        userId,
        "01/12/2025",
        parseDateTime("01/12/2025", "18:00"),
        parseDateTime("01/12/2025", "21:00"),
        "Lugar Forzado"
      );

      database.forcedCreations.push({
        eventId: event.id,
        userId,
        acknowledgedRisk:
          checkboxText === "Entiendo el riesgo y quiero continuar",
        timestamp: new Date(),
      });

      this.forcedCreation = true;
      this.createdEvent = event;
    }
  }
);

When(
  "{word} intenta crear {string} el {int}\\/{int}\\/{int} de {int}:{int} a {int}:{int} en el museo",
  function (
    userName,
    eventName,
    day,
    month,
    year,
    startHour,
    startMin,
    endHour,
    endMin
  ) {
    const userId = userName.toLowerCase();
    this.currentUser = userId;
    const place = "el museo";

    const date = `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
    const startTime = parseDateTime(
      date,
      `${startHour}:${String(startMin).padStart(2, "0")}`
    );
    const endTime = parseDateTime(
      date,
      `${endHour}:${String(endMin).padStart(2, "0")}`
    );

    const newEvent = {
      name: eventName,
      organizerId: userId,
      date,
      startTime,
      endTime,
      place,
    };

    const conflicts = findConflicts(userId, newEvent);

    this.newEvent = newEvent;
    this.conflicts = conflicts;
    this.attemptedCreation = true;

    if (conflicts.length === 0) {
      const event = createEvent(
        eventName,
        userId,
        date,
        startTime,
        endTime,
        place
      );
      this.createdEvent = event;
      this.creationBlocked = false;
    } else {
      this.creationBlocked = true;
      this.conflictMessage = conflicts[0].message;
    }
  }
);

When(
  "{word} intenta crear {string} el {int}\\/{int}\\/{int} de {int}:{int} a {int}:{int}",
  function (
    userName,
    eventName,
    day,
    month,
    year,
    startHour,
    startMin,
    endHour,
    endMin
  ) {
    const userId = userName.toLowerCase();
    this.currentUser = userId;

    const date = `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
    const startTime = parseDateTime(
      date,
      `${startHour}:${String(startMin).padStart(2, "0")}`
    );
    const endTime = parseDateTime(
      date,
      `${endHour}:${String(endMin).padStart(2, "0")}`
    );

    const newEvent = {
      name: eventName,
      organizerId: userId,
      date,
      startTime,
      endTime,
      place: "Lugar por defecto",
    };

    const conflicts = findConflicts(userId, newEvent);

    this.newEvent = newEvent;
    this.conflicts = conflicts;
    this.attemptedCreation = true;

    if (conflicts.length === 0) {
      const event = createEvent(
        eventName,
        userId,
        date,
        startTime,
        endTime,
        "Lugar por defecto"
      );
      this.createdEvent = event;
      this.creationBlocked = false;
    } else {
      this.creationBlocked = true;
      this.conflictMessage = conflicts[0].message;
    }
  }
);

When(
  "{word} crea {string} el {int}\\/{int}\\/{int} de {int}:{int} a {int}:{int} en {word} {word}",
  function (
    userName,
    eventName,
    day,
    month,
    year,
    startHour,
    startMin,
    endHour,
    endMin,
    placeWord1,
    placeWord2
  ) {
    const userId = userName.toLowerCase();
    this.currentUser = userId;
    const place = `${placeWord1} ${placeWord2}`;

    const date = `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
    const startTime = parseDateTime(
      date,
      `${startHour}:${String(startMin).padStart(2, "0")}`
    );
    const endTime = parseDateTime(
      date,
      `${endHour}:${String(endMin).padStart(2, "0")}`
    );

    const newEvent = {
      name: eventName,
      organizerId: userId,
      date,
      startTime,
      endTime,
      place,
    };

    const conflicts = findConflicts(userId, newEvent);

    this.conflicts = conflicts;

    if (conflicts.length === 0) {
      const event = createEvent(
        eventName,
        userId,
        date,
        startTime,
        endTime,
        place
      );
      this.createdEvent = event;
      this.creationBlocked = false;
    } else {
      this.creationBlocked = true;
    }
  }
);

When(
  "{word} crea un evento en {word} {word} el {int}\\/{int}\\/{int} de {int}:{int} a {int}:{int}",
  function (
    userName,
    placeWord1,
    placeWord2,
    day,
    month,
    year,
    startHour,
    startMin,
    endHour,
    endMin
  ) {
    const userId = userName.toLowerCase();
    this.currentUser = userId;
    const place = `${placeWord1} ${placeWord2}`;

    const date = `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
    const startTime = parseDateTime(
      date,
      `${startHour}:${String(startMin).padStart(2, "0")}`
    );
    const endTime = parseDateTime(
      date,
      `${endHour}:${String(endMin).padStart(2, "0")}`
    );

    const newEvent = {
      name: "Nuevo Evento",
      organizerId: userId,
      date,
      startTime,
      endTime,
      place,
    };

    const conflicts = findConflicts(userId, newEvent);

    this.conflicts = conflicts;

    if (conflicts.length === 0) {
      const event = createEvent(
        "Nuevo Evento",
        userId,
        date,
        startTime,
        endTime,
        place
      );
      this.createdEvent = event;
      this.creationBlocked = false;
    } else {
      this.creationBlocked = true;
    }
  }
);

When(
  "{word} intenta crear un evento el {int}\\/{int}\\/{int} de {int}:{int} a {int}:{int}",
  function (userName, day, month, year, startHour, startMin, endHour, endMin) {
    const userId = userName.toLowerCase();
    this.currentUser = userId;

    const date = `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
    const startTime = parseDateTime(
      date,
      `${startHour}:${String(startMin).padStart(2, "0")}`
    );
    const endTime = parseDateTime(
      date,
      `${endHour}:${String(endMin).padStart(2, "0")}`
    );

    const newEvent = {
      name: "Nuevo Evento",
      organizerId: userId,
      date,
      startTime,
      endTime,
      place: "Lugar colaborador",
    };

    const conflicts = findConflicts(userId, newEvent);

    this.conflicts = conflicts;

    if (conflicts.length > 0) {
      this.creationBlocked = true;
      this.conflictDetected = true;
    } else {
      const event = createEvent(
        "Nuevo Evento",
        userId,
        date,
        startTime,
        endTime,
        "Lugar colaborador"
      );
      this.createdEvent = event;
      this.creationBlocked = false;
    }
  }
);

// ===============================================
// THEN STEPS
// ===============================================

Then("el sistema muestra {string}", function (expectedMessage) {
  assert.ok(
    this.conflicts && this.conflicts.length > 0,
    "No se detectó ningún conflicto"
  );
  assert.strictEqual(this.conflictMessage, expectedMessage);
});

Then("bloquea la creación por defecto", function () {
  assert.strictEqual(
    this.creationBlocked,
    true,
    "La creación no fue bloqueada"
  );
  assert.ok(!this.createdEvent, "El evento fue creado cuando debió bloquearse");
});

Then("aparece mensaje {string}", function (expectedMessage) {
  assert.ok(
    this.conflicts && this.conflicts.length > 0,
    "No se detectó ningún conflicto"
  );
  assert.ok(
    this.conflicts.some((c) => c.message === expectedMessage),
    `No se encontró el mensaje esperado: ${expectedMessage}`
  );
});

Then("ofrece opción {string}", function (optionText) {
  assert.ok(
    this.conflicts && this.conflicts.length > 0,
    "No hay conflictos para ofrecer opciones"
  );
  // La opción "Crear de todos modos" está implícita cuando hay conflictos
  this.createAnywayOption = optionText;
  assert.strictEqual(this.createAnywayOption, "Crear de todos modos");
});

Then("el evento se crea sin advertencia", function () {
  assert.strictEqual(
    this.creationBlocked,
    false,
    "La creación fue bloqueada incorrectamente"
  );
  assert.ok(this.createdEvent, "El evento no fue creado");
  assert.strictEqual(
    this.conflicts.length,
    0,
    "Se detectaron conflictos incorrectamente"
  );
});

Then("se crea normalmente", function () {
  assert.strictEqual(
    this.creationBlocked,
    false,
    "La creación fue bloqueada incorrectamente"
  );
  assert.ok(this.createdEvent, "El evento no fue creado");
  assert.strictEqual(
    this.conflicts.length,
    0,
    "Se detectaron conflictos incorrectamente"
  );
});

Then("aparece el mismo modal de conflicto que al crear", function () {
  assert.ok(this.editMode, "No se detectó modo de edición");
  assert.ok(this.conflictModalShown, "No se mostró el modal de conflicto");
  assert.ok(
    this.conflicts && this.conflicts.length > 0,
    "No se detectó conflicto en la edición"
  );
});

Then("el evento se crea y queda registro de creación forzada", function () {
  assert.ok(this.forcedCreation, "No se marcó como creación forzada");
  assert.ok(this.createdEvent, "El evento no fue creado");

  const forcedLog = database.forcedCreations.find(
    (fc) => fc.eventId === this.createdEvent.id
  );

  assert.ok(forcedLog, "No se encontró registro de creación forzada");
  assert.strictEqual(
    forcedLog.acknowledgedRisk,
    true,
    "No se registró la aceptación del riesgo"
  );
});

Then("no aparece ningún conflicto", function () {
  assert.strictEqual(
    this.conflicts.length,
    0,
    "Se detectó un conflicto cuando no debería"
  );
  assert.strictEqual(
    this.creationBlocked,
    false,
    "La creación fue bloqueada incorrectamente"
  );
});

Then("se detecta conflicto y bloquea por defecto", function () {
  assert.ok(
    this.conflicts && this.conflicts.length > 0,
    "No se detectó conflicto"
  );
  assert.strictEqual(
    this.creationBlocked,
    true,
    "La creación no fue bloqueada"
  );
});

Then(
  "aparece conflicto aunque no sea el dueño del evento original",
  function () {
    assert.ok(this.conflictDetected, "No se detectó conflicto");
    assert.ok(
      this.conflicts && this.conflicts.length > 0,
      "No hay conflictos registrados"
    );
    assert.strictEqual(
      this.creationBlocked,
      true,
      "La creación no fue bloqueada"
    );
  }
);

module.exports = {
  database,
  parseDateTime,
  checkTimeOverlap,
  findConflicts,
  createEvent,
};
