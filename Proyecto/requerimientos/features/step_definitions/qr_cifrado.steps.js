const { Given, When, Then } = require('@cucumber/cucumber');

Given('Joey compra dos boletos válidos', function () { return 'pending'; });
When('se generan los QR correspondientes', function () { return 'pending'; });
Then('cada boleto tiene un QR único', function () { return 'pending'; });

Given('un boleto pagado con QR generado', function () { return 'pending'; });
When('Rachel intenta leer el contenido del QR manualmente', function () { return 'pending'; });
Then('el contenido no es legible en texto claro', function () { return 'pending'; });

Given('un boleto con QR generado', function () { return 'pending'; });
When('el sistema desencripta el QR', function () { return 'pending'; });
Then('encuentra el ticketID correspondiente', function () { return 'pending'; });

Given('Monica tiene un boleto pendiente de pago', function () { return 'pending'; });
When('intenta obtener su QR', function () { return 'pending'; });
Then('el sistema no genera el QR', function () { return 'pending'; });

Given('Joey escanea el QR en la entrada por primera vez', function () { return 'pending'; });
When('intenta escanearlo otra vez', function () { return 'pending'; });
Then('el sistema lo rechaza', function () { return 'pending'; });

Given('Ross escanea su boleto', function () { return 'pending'; });
When('el sistema detecta que ya fue usado', function () { return 'pending'; });
Then('marca el QR como inválido', function () { return 'pending'; });

Given('un QR válido es escaneado', function () { return 'pending'; });
When('se valida el acceso', function () { return 'pending'; });
Then('el sistema registra la validación en bitácora', function () { return 'pending'; });

Given('Chandler altera manualmente su QR', function () { return 'pending'; });
When('intenta validarlo en el acceso', function () { return 'pending'; });
Then('el sistema lo bloquea', function () { return 'pending'; });

Given('un QR válido', function () { return 'pending'; });
When('se escanea con la app oficial de Arcana', function () { return 'pending'; });
Then('se valida correctamente', function () { return 'pending'; });

Given('Monica tiene un boleto pagado', function () { return 'pending'; });
When('abre Mis Boletos', function () { return 'pending'; });
Then('su QR cifrado es visible', function () { return 'pending'; });
