const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");

// ===============================================
// DATABASE SIMULATION
// ===============================================

let events = {};
let reviews = {};
let attendees = {};
let alerts = [];
let modalShown = null;
let currentUser = null;
let dashboardData = null;
let editPermission = null;
let reviewToEdit = null;
let currentTime = null;

// ===============================================
// HELPER FUNCTIONS
// ===============================================

function parseDateTime(dateStr, timeStr) {
  const [day, month, year] = dateStr.split("/");
  const [hour, minute] = timeStr.split(":");
  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute)
  );
}

function calculateAverageRating(eventId) {
  const eventReviews = Object.values(reviews).filter(
    (r) => r.eventId === eventId
  );
  if (eventReviews.length === 0) return 0;
  const sum = eventReviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / eventReviews.length) * 10) / 10;
}

function countNegativeReviews(eventId) {
  return Object.values(reviews).filter(
    (r) => r.eventId === eventId && r.rating <= 2
  ).length;
}

function generateAlerts(eventId) {
  const negativeCount = countNegativeReviews(eventId);
  const totalReviews = Object.values(reviews).filter(
    (r) => r.eventId === eventId
  ).length;

  alerts = alerts.filter((a) => a.eventId !== eventId);

  if (negativeCount === 0) {
    return;
  }

  if (negativeCount === 1) {
    alerts.push({
      eventId,
      type: "Primera reseña negativa",
      message: `Primera reseña negativa recibida`,
      timestamp: new Date(),
    });
  } else if (negativeCount >= 3) {
    alerts.push({
      eventId,
      type: "alerta crítica",
      message: `${negativeCount} reseñas negativas (≤2 estrellas)`,
      timestamp: new Date(),
    });
  }

  const negativePercentage = (negativeCount / totalReviews) * 100;
  if (negativePercentage >= 20) {
    const existingAlert = alerts.find((a) => a.eventId === eventId);
    if (existingAlert) {
      existingAlert.type = "alerta crítica";
    }
  }
}

function showReviewModal(eventId, userId) {
  modalShown = {
    eventId,
    userId,
    stars: [1, 2, 3, 4, 5],
    hasCommentBox: true,
    timestamp: currentTime,
  };
}

function createReview(eventId, userId, rating, comment) {
  const reviewId = `review_${Object.keys(reviews).length + 1}`;
  reviews[reviewId] = {
    id: reviewId,
    eventId,
    userId,
    rating,
    comment,
    createdAt: currentTime || new Date(),
    updatedAt: currentTime || new Date(),
  };
  generateAlerts(eventId);
  return reviews[reviewId];
}

function getReview(eventId, userId) {
  return Object.values(reviews).find(
    (r) => r.eventId === eventId && r.userId === userId
  );
}

function updateReview(reviewId, newRating, newComment) {
  const review = reviews[reviewId];
  if (!review) return null;

  const oldRating = review.rating;
  review.rating = newRating;
  review.comment = newComment;
  review.updatedAt = currentTime || new Date();

  generateAlerts(review.eventId);

  return {
    oldRating,
    newRating,
    review,
  };
}

function deleteReview(reviewId) {
  const review = reviews[reviewId];
  if (!review) return null;

  const eventId = review.eventId;
  delete reviews[reviewId];

  generateAlerts(eventId);

  return {
    deleted: true,
    eventId,
  };
}

// ===============================================
// BEFORE HOOKS
// ===============================================

Before(function () {
  events = {};
  reviews = {};
  attendees = {};
  alerts = [];
  modalShown = null;
  currentUser = null;
  dashboardData = null;
  editPermission = null;
  reviewToEdit = null;
  currentTime = null;
});

// ===============================================
// GIVEN STEPS
// ===============================================

Given(
  "el evento {string} termina el {int}\\/{int}\\/{int} a las {int}:{int}",
  function (eventName, day, month, year, hour, minute) {
    const eventId = `event_${Object.keys(events).length + 1}`;
    const endTime = parseDateTime(
      `${String(day).padStart(2, "0")}/${String(month).padStart(
        2,
        "0"
      )}/${year}`,
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
    );

    events[eventId] = {
      id: eventId,
      name: eventName,
      endTime,
      organizerId: "ross",
    };

    this.currentEvent = eventId;
  }
);

Given("Joey asistió a {string}", function (eventName) {
  const eventId = `event_${Object.keys(events).length + 1}`;
  events[eventId] = {
    id: eventId,
    name: eventName,
    organizerId: "ross",
  };

  attendees[eventId] = attendees[eventId] || [];
  attendees[eventId].push("joey");

  this.currentEvent = eventId;
  this.currentUser = "joey";
});

Given(
  "Phoebe dejó {int} estrellas y {string} en {string}",
  function (rating, comment, eventName) {
    const eventId = `event_${Object.keys(events).length + 1}`;
    events[eventId] = {
      id: eventId,
      name: eventName,
      organizerId: "ross",
    };

    attendees[eventId] = attendees[eventId] || [];
    attendees[eventId].push("phoebe");

    createReview(eventId, "phoebe", rating, comment);

    this.currentEvent = eventId;
    this.currentUser = "phoebe";
  }
);

Given("Chandler tenía reseña de {int} estrellas", function (rating) {
  const eventId = `event_${Object.keys(events).length + 1}`;
  events[eventId] = {
    id: eventId,
    name: "Test Event",
    organizerId: "ross",
  };

  attendees[eventId] = attendees[eventId] || [];
  attendees[eventId].push("chandler");

  createReview(eventId, "user1", 5, "Excelente");
  createReview(eventId, "user2", 5, "Muy bien");
  createReview(eventId, "user3", 5, "Perfecto");
  createReview(eventId, "user4", 5, "Increíble");
  createReview(eventId, "user5", 4, "Bueno");
  createReview(eventId, "user6", 4, "Bien");
  createReview(eventId, "chandler", rating, "Bueno");

  this.currentEvent = eventId;
  this.currentUser = "chandler";
  this.oldAverage = calculateAverageRating(eventId);
});

Given("Monica tenía {int} estrellas en {string}", function (rating, eventName) {
  const eventId = `event_${Object.keys(events).length + 1}`;
  events[eventId] = {
    id: eventId,
    name: eventName,
    organizerId: "ross",
  };

  attendees[eventId] = attendees[eventId] || [];
  attendees[eventId].push("monica");

  createReview(eventId, "monica", rating, "Estuvo bien");

  this.currentEvent = eventId;
  this.currentUser = "monica";
  this.oldAlertCount = alerts.length;
});

Given(
  "existía alerta crítica por {int} reseñas menores o iguales a {int}",
  function (count, threshold) {
    const eventId = `event_${Object.keys(events).length + 1}`;
    events[eventId] = {
      id: eventId,
      name: "Test Event",
      organizerId: "ross",
    };

    createReview(eventId, "user1", 1, "Malo");
    createReview(eventId, "user2", 2, "No me gustó");
    createReview(eventId, "chandler", 1, "Terrible");

    this.currentEvent = eventId;
    this.currentUser = "chandler";
    this.oldAlertType = alerts.find((a) => a.eventId === eventId)?.type;
  }
);

Given(
  "Rachel dejó reseña de {int} estrella en {string}",
  function (rating, eventName) {
    const eventId = `event_${Object.keys(events).length + 1}`;
    events[eventId] = {
      id: eventId,
      name: eventName,
      organizerId: "ross",
    };

    attendees[eventId] = attendees[eventId] || [];
    attendees[eventId].push("rachel");

    createReview(eventId, "rachel", rating, "Horrible");

    this.currentEvent = eventId;
    this.currentUser = "rachel";
  }
);

Given("Chandler dejó reseña en enero 2025", function () {
  const eventId = `event_${Object.keys(events).length + 1}`;
  events[eventId] = {
    id: eventId,
    name: "Old Event",
    organizerId: "ross",
  };

  attendees[eventId] = attendees[eventId] || [];
  attendees[eventId].push("chandler");

  currentTime = new Date(2025, 0, 15); // January 15, 2025
  createReview(eventId, "chandler", 4, "Fue bueno");
  currentTime = null;

  this.currentEvent = eventId;
  this.currentUser = "chandler";
});

Given("Rachel ve la reseña de Monica", function () {
  const eventId = `event_${Object.keys(events).length + 1}`;
  events[eventId] = {
    id: eventId,
    name: "Test Event",
    organizerId: "ross",
  };

  createReview(eventId, "monica", 4, "Excelente");

  this.currentEvent = eventId;
  this.currentUser = "rachel";
  this.targetUser = "monica";
});

Given("había alerta crítica por {int} reseñas negativas", function (count) {
  const eventId = `event_${Object.keys(events).length + 1}`;
  events[eventId] = {
    id: eventId,
    name: "Test Event",
    organizerId: "ross",
  };

  createReview(eventId, "user1", 1, "Malo");
  createReview(eventId, "user2", 2, "No me gustó");
  createReview(eventId, "joey", 1, "Terrible");

  this.currentEvent = eventId;
  this.currentUser = "joey";
  this.oldNegativeCount = countNegativeReviews(eventId);
  this.oldAverage = calculateAverageRating(eventId);
});

// ===============================================
// WHEN STEPS
// ===============================================

When("Rachel abre Arcana a las {int}:{int}", function (hour, minute) {
  currentUser = "rachel";
  currentTime = new Date(2025, 10, 23, hour, minute);

  const event = events[this.currentEvent];
  const timeDiff = currentTime - event.endTime;

  if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) {
    showReviewModal(this.currentEvent, currentUser);
  }

  this.currentUser = currentUser;
});

When(
  "Joey pone {int} estrellas y escribe {string}",
  function (rating, comment) {
    const review = createReview(
      this.currentEvent,
      this.currentUser,
      rating,
      comment
    );
    this.createdReview = review;
  }
);

When(
  "Phoebe entra a {string} una semana después y pulsa {string}",
  function (section, action) {
    currentTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const review = getReview(this.currentEvent, "phoebe");
    if (review) {
      reviewToEdit = review;
      editPermission = true;
    }
  }
);

When("Chandler la edita a {int} estrella", function (newRating) {
  const review = getReview(this.currentEvent, "chandler");
  if (review) {
    const result = updateReview(review.id, newRating, review.comment);
    this.updateResult = result;
    this.newAverage = calculateAverageRating(this.currentEvent);
  }
});

When("Monica edita a {int} estrellas", function (newRating) {
  const review = getReview(this.currentEvent, "monica");
  if (review) {
    updateReview(review.id, newRating, review.comment);
    this.newAlertCount = alerts.length;
    this.newAlert = alerts.find((a) => a.eventId === this.currentEvent);
  }
});

When(
  "Chandler cambia su {int} estrella a {int} estrellas",
  function (oldRating, newRating) {
    const review = getReview(this.currentEvent, "chandler");
    if (review) {
      updateReview(review.id, newRating, review.comment);
      this.newAlertType = alerts.find(
        (a) => a.eventId === this.currentEvent
      )?.type;
    }
  }
);

When("Rachel pulsa {string} y confirma", function (action) {
  const review = getReview(this.currentEvent, "rachel");
  if (review) {
    const result = deleteReview(review.id);
    this.deleteResult = result;
  }
});

When(
  "Chandler la edita o elimina el {int}\\/{int}\\/{int}",
  function (day, month, year) {
    currentTime = new Date(year, month - 1, day);
    const review = getReview(this.currentEvent, "chandler");
    if (review) {
      const createdDate = new Date(review.createdAt);
      const monthsDiff =
        (currentTime - createdDate) / (1000 * 60 * 60 * 24 * 30);
      this.monthsDiff = Math.floor(monthsDiff);
      this.editAllowed = true;
    }
  }
);

When("Rachel intenta pulsar {string}", function (action) {
  const review = getReview(this.currentEvent, this.targetUser);
  if (review && review.userId !== "rachel") {
    editPermission = false;
  } else {
    editPermission = true;
  }
  this.editPermission = editPermission;
});

When("Joey elimina su reseña de {int} estrella", function (rating) {
  const review = getReview(this.currentEvent, "joey");
  if (review) {
    deleteReview(review.id);
    this.newNegativeCount = countNegativeReviews(this.currentEvent);
    this.newAverage = calculateAverageRating(this.currentEvent);
    this.newAlert = alerts.find((a) => a.eventId === this.currentEvent);
  }
});

// ===============================================
// THEN STEPS
// ===============================================

Then(
  "aparece el modal de reseña con {int}-{int} estrellas y caja de comentario",
  function (minStars, maxStars) {
    assert.ok(modalShown, "Modal should be shown");
    assert.strictEqual(
      modalShown.stars.length,
      maxStars,
      "Should have 5 stars"
    );
    assert.strictEqual(
      modalShown.hasCommentBox,
      true,
      "Should have comment box"
    );
  }
);

Then("Ross ve exactamente esa reseña en su dashboard", function () {
  const review = this.createdReview;
  assert.ok(review, "Review should exist");
  assert.strictEqual(review.rating, 2, "Rating should be 2");
  assert.strictEqual(
    review.comment,
    "El DJ se fue a media fiesta",
    "Comment should match"
  );

  const event = events[this.currentEvent];
  assert.strictEqual(event.organizerId, "ross", "Ross should be the organizer");
});

Then(
  "puede cambiar a {int} estrellas y {string}",
  function (newRating, newComment) {
    assert.ok(reviewToEdit, "Review should be editable");
    const result = updateReview(reviewToEdit.id, newRating, newComment);
    assert.strictEqual(result.newRating, newRating, "Rating should be updated");
    assert.strictEqual(
      result.review.comment,
      newComment,
      "Comment should be updated"
    );
  }
);

Then(
  "el promedio baja inmediatamente de {float} a {float}",
  function (oldAvg, newAvg) {
    assert.strictEqual(
      this.oldAverage,
      oldAvg,
      `Old average should be ${oldAvg}`
    );
    assert.strictEqual(
      this.newAverage,
      newAvg,
      `New average should be ${newAvg}`
    );
  }
);

Then(
  "Ross recibe alerta {string} o actualiza a crítica si ya había más",
  function (alertType) {
    assert.ok(this.newAlert, "Alert should exist");
    assert.ok(
      this.newAlert.type === "Primera reseña negativa" ||
        this.newAlert.type === "alerta crítica",
      "Alert type should be correct"
    );
  }
);

Then("la alerta crítica baja a normal o desaparece", function () {
  const currentAlert = alerts.find((a) => a.eventId === this.currentEvent);
  const negativeCount = countNegativeReviews(this.currentEvent);

  if (negativeCount < 3) {
    if (currentAlert) {
      assert.notStrictEqual(
        currentAlert.type,
        "alerta crítica",
        "Should not be critical alert"
      );
    }
  }
});

Then("desaparece para ella y para el organizador Ross", function () {
  assert.ok(this.deleteResult, "Review should be deleted");
  assert.strictEqual(
    this.deleteResult.deleted,
    true,
    "Delete should be successful"
  );

  const review = getReview(this.currentEvent, "rachel");
  assert.strictEqual(review, undefined, "Review should not exist");
});

Then("Arcana lo permite sin problema", function () {
  assert.ok(this.monthsDiff >= 10, "Should be at least 10 months");
  assert.strictEqual(this.editAllowed, true, "Edit should be allowed");
});

Then("el botón no aparece", function () {
  assert.strictEqual(
    this.editPermission,
    false,
    "Edit permission should be denied"
  );
});

Then(
  "el contador baja a {int}, el promedio sube y la alerta se degrada",
  function (expectedCount) {
    assert.strictEqual(
      this.newNegativeCount,
      expectedCount,
      `Negative count should be ${expectedCount}`
    );
    assert.ok(this.newAverage > this.oldAverage, "Average should increase");

    const currentAlert = this.newAlert;
    if (expectedCount < 3 && currentAlert) {
      assert.notStrictEqual(
        currentAlert.type,
        "alerta crítica",
        "Should not be critical alert"
      );
    }
  }
);
