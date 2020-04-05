﻿//"use strict";
var buzzerSound = {
    context: null,
    default_freq: 200,
    channels: {},
    muted: {},

    getContext: function() {
        if(!this.context) {
            this.context = ('AudioContext' in window) || ('webkitAudioContext' in window) ? new(window.AudioContext || window.webkitAudioContext)() : null;
        }
        return this.context;
    },

    startOscillator: function(freq) {
        var o = this.context.createOscillator();
        o.type = 'sine';
        o.frequency.value = freq;
        o.connect(this.context.destination);
        o.start();
        return o;
    },


    start: function(channel, freq=this.default_freq) {
        if(!this.channels[channel]) {
            this.channels[channel] = {
                muted: false
            }
        }
        if(this.channels[channel].freq === freq) {
            return;
        }
        var context = this.getContext();
        if(!context) {
            return;
        }
        this.stop(channel);

        if (freq == 0 || this.channels[channel].muted) {
            return;
        }
        
        this.channels[channel].oscillator = this.startOscillator(freq);
        this.channels[channel].freq = freq;
    },

    stop: function(channel) {
        if(this.channels[channel]) {
            this.channels[channel].oscillator && this.channels[channel].oscillator.stop();
            delete this.channels[channel].oscillator;
            delete this.channels[channel].freq;
        }
    },

    mute: function(channel) {
        if(!this.channels[channel]) {
            this.channels[channel] = {
                muted: true
            }
            return;
        }
        this.channels[channel].muted = true;
        this.channels[channel].oscillator && this.channels[channel].oscillator.stop();
        delete this.channels[channel].oscillator;
    },

    unmute: function(channel) {
        if(!this.channels[channel]) {
            this.channels[channel] = {
                muted: false
            }
            return;
        }
        this.channels[channel].muted = false;
        if(this.channels[channel].freq) {
            this.channels[channel].oscillator = this.startOscillator(this.channels[channel].freq);
        }
    },

    isMuted: function(channel) {
        if(this.channels[channel]) {
            return this.channels[channel].muted;
        }
        return false;
    },

    stopAll: function() {
        for(var channel in this.channels) {
            if(this.channels.hasOwnProperty(channel)) {
                this.stop(channel);
            }
        }
    }
}



var gyroscope3D = (function() {

    var instance;

    function createInstance(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // debug code start
        /*
        canvas.style.zIndex = 99999;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        document.body.appendChild(canvas);
        */
        // debug code end

        try {
            var renderer = new zen3d.Renderer(canvas, { antialias: true, alpha: true });
        } catch(e) {
            return false;
        }
        
        renderer.glCore.state.colorBuffer.setClear(0, 0, 0, 0);
    
        var scene = new zen3d.Scene();
    
        var lambert = new zen3d.LambertMaterial();
        lambert.diffuse.setHex(0x468DDF);            
       
        var cube_geometry = new zen3d.CubeGeometry(10, 2, 10);
        var cube = new zen3d.Mesh(cube_geometry, lambert);
        cube.position.x = 0;
        cube.position.y = 0;
        cube.position.z = 0;
        scene.add(cube);
    
        var ambientLight = new zen3d.AmbientLight(0xffffff, 2);
        scene.add(ambientLight);
    
        var pointLight = new zen3d.PointLight(0xffffff, 1, 100);
        pointLight.position.set(-20, 40, 10);
        scene.add(pointLight);            
    
        var camera = new zen3d.Camera();
        camera.position.set(0, 13, 13);
        camera.lookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 1, 0));
        camera.setPerspective(45 / 180 * Math.PI, width / height, 1, 1000);
        scene.add(camera);    
    
    
        return {
            resize: function(width, height) {
                camera.setPerspective(
                    45 / 180 * Math.PI, 
                    width / height, 
                    1, 
                    1000
                );
            },
    
            render: function(ax, ay, az) {
                cube.euler.x = Math.PI * ax / 360;
                cube.euler.y = Math.PI * ay / 360;
                cube.euler.z = Math.PI * az / 360;
                renderer.render(scene, camera);
                return canvas;
            }
        }
    }

    return {
        getInstance: function(width, height) {
            if(!instance) {
                instance = createInstance(width, height);
            } else {
                instance.resize(width, height)
            }
            return instance;
        }
    }

})();


// This is a template of library for use with quickAlgo.
var getContext = function (display, infos, curLevel) {

    window.quickAlgoInterface.stepDelayMin = 0.0001;

    // Local language strings for each language
    var introControls = null;
    var localLanguageStrings = {
        fr: { // French strings
            label: {
                // Labels for the blocks
                sleep: "attendre %1 millisecondes",
                currentTime: "temps écoulé en millisecondes",

                turnLedOn: "allumer la LED",
                turnLedOff: "éteindre la LED",

                setLedState: "passer la LED %1 à %2 ",
                toggleLedState: "inverser la LED %1",

                isLedOn: "LED allumée",
                isLedOnWithName: "LED %1 allumée",

                setLedBrightness: "mettre la luminosité de %1 à %2",
                getLedBrightness: "lire la luminosité de %1",

                turnBuzzerOn: "allumer le buzzer",
                turnBuzzerOff: "éteindre le buzzer",
                setBuzzerState: "mettre le buzzer %1 à %2",
                isBuzzerOn: "buzzer allumé",
                isBuzzerOnWithName: "buzzer %1 allumé",

                setBuzzerNote: "jouer la fréquence %2Hz sur %1",
                getBuzzerNote: "fréquence du buzzer %1",

                isButtonPressed: "bouton enfoncé",
                isButtonPressedWithName: "bouton  %1 enfoncé",
                waitForButton: "attendre une pression sur le bouton",
                buttonWasPressed: "le bouton a été enfoncé",

                displayText: "afficher %1",
                displayText2Lines: "afficher Ligne 1: %1 Ligne 2: %2",

                readTemperature: "température ambiante",
                getTemperature: "temperature de %1",

                readRotaryAngle: "état du potentiomètre %1",
                readDistance: "distance mesurée par %1",
                readLightIntensity: "intensité lumineuse",
                readHumidity: "humidité ambiante",

                setServoAngle: "mettre le servo %1 à l'angle %2",
                getServoAngle: "angle du servo %1",


                drawPoint: "draw pixel",
                drawLine: "ligne x₀: %1 y₀: %2 x₁: %3 y₁: %4",
                drawRectangle: "rectangle x₀: %1 y₀: %2 largeur₀: %3 hauteur₀: %4",
                drawCircle: "cercle x₀: %1 y₀: %2 diamètre₀: %3",
                clearScreen: "effacer tout l'écran",
                updateScreen: "mettre à jour l'écran",
                autoUpdate: "mode de mise à jour automatique de l'écran",

                fill: "mettre la couleur de fond à %1",
                noFill: "ne pas remplir les formes",
                stroke: "mettre la couleur de tracé à %1",
                noStroke: "ne pas dessiner les contours",

                readAcceleration: "accélération en (m/s²) dans l'axe %1",
                computeRotation: "compute rotation from accelerometer (°) %1",
                readSoundLevel: "volume sonore",

                readMagneticForce: "read Magnetic Force (µT) %1",
                computeCompassHeading: "compute Compass Heading (°)",

                readInfraredState: "read Infrared Receiver State %1",
                setInfraredState: "set Infrared transmiter State %1",

                // Gyroscope
                readAngularVelocity: "read angular velocity (°/s) %1",
                setGyroZeroAngle: "set the gyroscope zero point",
                computeRotationGyro: "compute rotation in the gyroscope %1",
            },
            code: {
                // Names of the functions in Python, or Blockly translated in JavaScript
                turnLedOn: "turnLedOn",
                turnLedOff: "turnLedOff",
                setLedState: "setLedState",

                isButtonPressed: "isButtonPressed",
                isButtonPressedWithName : "isButtonPressed",
                waitForButton: "waitForButton",
                buttonWasPressed: "buttonWasPressed",

                toggleLedState: "toggleLedState",
                displayText: "displayText",
                displayText2Lines: "displayText",
                readTemperature: "readTemperature",
                sleep: "sleep",
                setServoAngle: "setServoAngle",
                readRotaryAngle: "readRotaryAngle",
                readDistance: "readDistance",
                readLightIntensity: "readLightIntensity",
                readHumidity: "readHumidity",
                currentTime: "currentTime",
                getTemperature: "getTemperature",

                isLedOn: "isLedOn",
                isLedOnWithName: "isLedOn",

                setBuzzerNote: "setBuzzerNote",
                getBuzzerNote: "getBuzzerNote",
                setLedBrightness: "setLedBrightness",
                getLedBrightness: "getLedBrightness",
                getServoAngle: "getServoAngle",

                setBuzzerState: "setBuzzerState",
                setBuzzerNote: "setBuzzerNote",

                turnBuzzerOn: "turnBuzzerOn",
                turnBuzzerOff: "turnBuzzerOff",
                isBuzzerOn: "isBuzzerOn",
                isBuzzerOnWithName: "isBuzzerOn",


                drawPoint: "drawPoint",
                drawLine: "drawLine",
                drawRectangle: "drawRectangle",
                drawCircle: "drawCircle",
                clearScreen: "clearScreen",
                updateScreen: "updateScreen",
                autoUpdate: "autoUpdate",

                fill: "fill",
                noFill: "noFill",
                stroke: "stroke",
                noStroke: "noStroke",


                readAcceleration: "readAcceleration",
                computeRotation: "computeRotation",

                readSoundLevel: "readSoundLevel",


                readMagneticForce: "readMagneticForce",
                computeCompassHeading: "computeCompassHeading",

                readInfraredState: "readInfraredState",
                setInfraredState: "setInfraredState",


                // Gyroscope
                readAngularVelocity: "readAngularVelocity",
                setGyroZeroAngle: "setGyroZeroAngle",
                computeRotationGyro: "computeRotationGyro",

            },
            description: {
                // Descriptions of the functions in Python (optional)
                turnLedOn: "turnLedOn() allume la LED",
                turnLedOff: "turnLedOff() éteint la LED",
                isButtonPressed: "isButtonPressed() retourne True si le bouton est enfoncé, False sinon",
                isButtonPressedWithName: "isButtonPressed(button) retourne True si le bouton est enfoncé, False sinon",
                waitForButton: "waitForButton(button) met en pause l'exécution jusqu'à ce que le bouton soit appuyé",
                buttonWasPressed: "buttonWasPressed(button) indique si le bouton a été appuyé depuis le dernier appel à cette fonction",
                setLedState: "setLedState(led, state) modifie l'état de la LED : True pour l'allumer, False pour l'éteindre",
                toggleLedState: "toggleLedState(led) inverse l'état de la LED",
                displayText: "displayText(line1, line2) affiche une ou deux lignes de texte. line2 est optionnel",
                displayText2Lines: "displayText(line1, line2) affiche une ou deux lignes de texte. line2 est optionnel",
                readTemperature: "readTemperature(thermometer) retourne la température ambiante",
                sleep: "sleep(milliseconds) met en pause l'exécution pendant une durée en ms",
                setServoAngle: "setServoAngle(servo, angle) change l'angle du servomoteur",
                readRotaryAngle: "readRotaryAngle(potentiometer) retourne la position potentiomètre",
                readDistance: "readDistance(distanceSensor) retourne la distance mesurée",
                readLightIntensity: "readLightIntensity(lightSensor) retourne l'intensité lumineuse",
                readHumidity: "readHumidity(hygrometer) retourne l'humidité ambiante",
                currentTime: "currentTime(milliseconds) temps en millisecondes depuis le début du programme",

                setLedBrightness: "setLedBrightness(led, brightness) règle l'intensité lumineuse de la LED",
                getLedBrightness: "getLedBrightness(led) retourne l'intensité lumineuse de la LED",
                getServoAngle: "getServoAngle(servo) retourne l'angle du servomoteur",

                isLedOn: "isLedOn() retourne True si la LED est allumée, False si elle est éteinte",
                isLedOnWithName: "isLedOn(led) retourne True si la LED est allumée, False sinon",

                turnBuzzerOn: "turnBuzzerOn() allume le buzzer",
                turnBuzzerOff: "turnBuzzerOff() éteint le buzzer",

                isBuzzerOn: "isBuzzerOn() retourne True si le buzzer est allumé, False sinon",
                isBuzzerOnWithName: "isBuzzerOn(buzzer) retourne True si le buzzer est allumé, False sinon",

                setBuzzerState: "setBuzzerState(buzzer, state) modifie l'état du buzzer: True pour allumé, False sinon",
                setBuzzerNote: "setBuzzerNote(buzzer, frequency) fait sonner le buzzer à la fréquence indiquée",
                getBuzzerNote: "getBuzzerNote(buzzer) retourne la fréquence actuelle du buzzer",

                getTemperature: "getTemperature(thermometer) ",

                drawPoint: "drawPoint(x, y)",
                drawLine: "drawLine(x0, y0, x1, y1)",
                drawRectangle: "drawRectangle(x0, y0, width, height)",
                drawCircle: "drawCircle(x0, y0, diameter)",
                clearScreen: "clearScreen()",
                updateScreen: "updateScreen()",
                autoUpdate: "autoUpdate(auto)",

                fill: "fill(color)",
                noFill: "noFill()",
                stroke: "stroke(color)",
                noStroke: "noStroke()",


                readAcceleration: "readAcceleration(axis)",
                computeRotation: "computeRotation()",

                readSoundLevel: "readSoundLevel(port)",


                readMagneticForce: "readMagneticForce(axis)",
                computeCompassHeading: "computeCompassHeading()",

                readInfraredState: "readInfraredState()",
                setInfraredState: "setInfraredState()",

                // Gyroscope
                readAngularVelocity: "readAngularVelocity()",
                setGyroZeroAngle: "setGyroZeroAngle()",
                computeRotationGyro: "computeRotationGyro()",
            },
            constant: {
            },

            startingBlockName: "Programme", // Name for the starting block
            messages: {
                sensorNotFound: "Accès à un capteur ou actuateur inexistant : {0}.",
                manualTestSuccess: "Test automatique validé.",
                testSuccess: "Bravo ! La sortie est correcte",
                wrongState: "Test échoué : {0} a été dans l'état {1} au lieu de {2} à t={3}ms.",
                wrongStateDrawing: "Test échoué : {0} diffère de {1} pixels par rapport à l'affichage attendu à t={2}ms.",
                wrongStateSensor: "Test échoué : votre programme n'a pas lu l'état de {0} après t={1}ms.",
                programEnded: "programme terminé.",
                piPlocked: "L'appareil est verrouillé. Déverrouillez ou redémarrez.",
                cantConnect: "Impossible de se connecter à l'appareil.",
                wrongVersion: "Votre Raspberry Pi a une version trop ancienne, mettez le à jour.",
                sensorInOnlineMode: "Vous ne pouvez pas agir sur les capteurs en mode connecté.",
                actuatorsWhenRunning: "Impossible de modifier les actionneurs lors de l'exécution d'un programme",
                cantConnectoToUSB: 'Tentative de connexion par USB en cours, veuillez brancher votre Raspberry sur le port USB <i class="fas fa-circle-notch fa-spin"></i>',
                cantConnectoToBT: 'Tentative de connection par Bluetooth, veuillez connecter votre appareil au Raspberry par Bluetooth <i class="fas fa-circle-notch fa-spin"></i>',
                canConnectoToUSB: "Connecté en USB.",
                canConnectoToBT: "Connecté en Bluetooth.",
                noPortsAvailable: "Aucun port compatible avec ce {0} n'est disponible (type {1})",
                sensor: "capteur",
                actuator: "actionneur",
                removeConfirmation: "Êtes-vous certain de vouloir retirer ce capteur ou actuateur?",
                remove: "Retirer",
                keep: "Garder",
                minutesago: "Last seen {0} minutes ago",
                hoursago: "Last seen more than one hour ago",
                drawing: "dessin",
                connectionHTML: `
                <div id="piui">
                    <button type="button" id="piconnect" class="btn">
                        <span class="fa fa-wifi"></span><span id="piconnecttext" class="btnText">Connecter</span> <span id="piconnectprogress" class="fas fa-spinner fa-spin"></span>
                    </button>

                    <span id="piinstallui">
                        <span class="fa fa-exchange-alt"></span>
                        <button type="button" id="piinstall" class="btn">
                            <span class="fa fa-upload"></span><span>Installer</span><span id=piinstallprogresss class="fas fa-spinner fa-spin"></span><span id="piinstallcheck" class="fa fa-check"></span>
                        </button>
                    </span>

                    <span id="pichangehatui">
                        <button type="button" id="pichangehat" class="btn">
                            <span class="fas fa-hat-wizard"></span><span>Changer de carte</span></span></span>
                        </button>
                        <button type="button" id="pihatsetup" class="btn">
                            <span class="fas fa-cog"></span><span>Config</span></span></span>
                        </button>
                    </span>
                </div>`,
                connectionDialogHTML: `
                <div class="content connectPi qpi">
                    <div class="panel-heading">
                        <h2 class="sectionTitle">
                            <span class="iconTag"><i class="icon fas fa-list-ul"></i></span>
                            Configuration du Raspberry Pi
                        </h2>
                        <div class="exit" id="picancel"><i class="icon fas fa-times"></i></div>
                    </div>
                    <div class="panel-body">
                        <div id="piconnectionmainui">
                            <div class="switchRadio btn-group" id="piconsel">
                                <button type="button" class="btn active" id="piconwifi"><i class="fa fa-wifi icon"></i>WiFi</button>
                                <button type="button" class="btn" id="piconusb"><i class="fab fa-usb icon"></i>USB</button>
                                <button type="button" class="btn" id="piconbt"><i class="fab fa-bluetooth-b icon"></i>Bluetooth</button>
                            </div>
                            <div id="pischoolcon">
                                <div class="form-group">
                                    <label id="pischoolkeylabel">Indiquez un identifiant d'école</label>
                                    <div class="input-group">
                                        <div class="input-group-prepend">Aa</div>
                                        <input type="text" id="schoolkey" class="form-control">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label id="pilistlabel">Sélectionnez un appareil à connecter dans la liste suivante</label>
                                    <div class="input-group">
                                        <button class="input-group-prepend" id=pigetlist disabled>Obtenir la liste</button>
                                        <select id="pilist" class="custom-select" disabled>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label id="piiplabel">ou entrez son adesse IP</label>
                                    <div class="input-group">
                                        <div class="input-group-prepend">123</div>
                                        <input id=piaddress type="text" class="form-control">
                                    </div>
                                </div>
                                <div>
                                    <input id="piusetunnel" disabled type="checkbox">Connecter à travers le France-ioi tunnel
                                </div>
                            </div>

                            <div panel-body-usbbt>
                                <label id="piconnectionlabel"></label>
                            </div>
                        </div>
                        <div class="inlineButtons">
                            <button id="piconnectok" class="btn"><i class="fa fa-wifi icon"></i>Connecter l'appareil</button>
                            <button id="pirelease" class="btn"><i class="fa fa-times icon"></i>Déconnecter</button>
                        </div>
                    </div>
                </div>
                `,
                stickPortsDialog: `
                <div class="content qpi">
                <div class="panel-heading">
                    <h2 class="sectionTitle">
                        <span class="iconTag"><i class="icon fas fa-list-ul"></i></span>
                        Stick names and port
                    </h2>
                    <div class="exit" id="picancel"><i class="icon fas fa-times"></i></div>
                </div>
                <div id="sensorPicker" class="panel-body">
                    <label></label>
                    <div class="flex-container">
                    <table style="display:table-header-group;">
                    <tr>
                    <th>Name</th>
                    <th>Port</th>
                    <th>State</th>
                    <th>Direction</th>
                    </tr>
                    <tr>
                    <td><label id="stickupname"></td><td><label id="stickupport"></td><td><label id="stickupstate"></td><td><label id="stickupdirection"><i class="fas fa-arrow-up"></i></td>
                    </tr>
                    <tr>
                    <td><label id="stickdownname"></td><td><label id="stickdownport"></td><td><label id="stickdownstate"></td><td><label id="stickdowndirection"><i class="fas fa-arrow-down"></i></td>
                    </tr>
                    <tr>
                    <td><label id="stickleftname"></td><td><label id="stickleftport"></td><td><label id="stickleftstate"></td><td><label id="stickleftdirection"><i class="fas fa-arrow-left"></i></td>
                    </tr>
                    <tr>
                    <td><label id="stickrightname"></td><td><label id="stickrightport"></td><td><label id="stickrightstate"></td><td><label id="stickrightdirection"><i class="fas fa-arrow-right"></i></td>
                    </tr>
                    <tr>
                    <td><label id="stickcentername"></td><td><label id="stickcenterport"></td><td><label id="stickcenterstate"></td><td><label id="stickcenterdirection"><i class="fas fa-circle"></i></td>
                    </tr>
                    </table>
                    </div>
                </div>
                <div class="singleButton">
                    <button id="picancel2" class="btn btn-centered"><i class="icon fa fa-check"></i>Fermer</button>
                </div>
            </div>

                `,

            }
        },
        none: {
            comment: {
                // Comments for each block, used in the auto-generated documentation for task writers
                turnLedOn: "Turns on a light connected to Raspberry",
                turnLedOff: "Turns off a light connected to Raspberry",
                isButtonPressed: "Returns the state of a button, Pressed means True and not pressed means False",
                waitForButton: "Stops program execution until a button is pressed",
                buttonWasPressed: "Returns true if the button has been pressed and will clear the value",
                setLedState: "Change led state in the given port",
                toggleLedState: "If led is on, turns it off, if it's off turns it on",
                isButtonPressedWithName: "Returns the state of a button, Pressed means True and not pressed means False",
                displayText: "Display text in LCD screen",
                displayText2Lines: "Display text in LCD screen (two lines)",
                readTemperature: "Read Ambient temperature",
                sleep: "pause program execute for a number of seconds",
                setServoAngle: "Set servo motor to an specified angle",
                readRotaryAngle: "Read state of potentiometer",
                readDistance: "Read distance using ultrasonic sensor",
                readLightIntensity: "Read light intensity",
                readHumidity: "lire l'humidité ambiante",
                currentTime: "returns current time",
                setBuzzerState: "sonnerie",
                setBuzzerNote: "sonnerie note",
                
                getTemperature: "Get temperature",



                setBuzzerNote: "Set buzzer note",
                getBuzzerNote: "Get buzzer note",
                setLedBrightness: "Set Led Brightness",
                getLedBrightness: "Get Led Brightness",
                getServoAngle: "Get Servo Angle",


                isLedOn: "Get led state",
                isLedOnWithName: "Get led state",

                turnBuzzerOn: "Turn Buzzer on",
                turnBuzzerOff: "Turn Buzzer off",
                isBuzzerOn: "Is Buzzer On",
                isBuzzerOnWithName: "get buzzer state",


                drawPoint: "drawPoint",
                drawLine: "drawLine",
                drawRectangle: "drawRectangle",
                drawCircle: "drawCircle",
                clearScreen: "clearScreen",
                updateScreen: "updateScreen",
                autoUpdate: "autoUpdate",

                fill: "fill",
                noFill: "noFill",
                stroke: "stroke",
                noStroke: "noStroke",

                readAcceleration: "readAcceleration",
                computeRotation: "computeRotation",

                readSoundLevel: "readSoundLevel",

                readMagneticForce: "readMagneticForce",
                computeCompassHeading: "computeCompassHeading",

                readInfraredState: "readInfraredState",
                setInfraredState: "setInfraredState",

                // Gyroscope
                readAngularVelocity: "readAngularVelocity",
                setGyroZeroAngle: "setGyroZeroAngle",
                computeRotationGyro: "computeRotationGyro",

            }
        }
    }

    // Create a base context
    var context = quickAlgoContext(display, infos);

    // Import our localLanguageStrings into the global scope
    var strings = context.setLocalLanguageStrings(localLanguageStrings);


    // Some data can be made accessible by the library through the context object
    context.quickpi = {};


    // List of concepts to be included by conceptViewer
    context.conceptList = [
        {id: 'language', ignore: true},
        {
           id: 'quickpi_start',
           name: 'Créer un programme',
           url: 'https://static4.castor-informatique.fr/help/quickpi.html#quickpi_start',
           language: 'all',
           isBase: true,
           order: 1,
           python: []
        },
        {
            id: 'quickpi_validation',
            name: 'Valider son programme',
            url: 'https://static4.castor-informatique.fr/help/quickpi.html#quickpi_validation',
            language: 'all',
            isBase: true,
            order: 2,
            python: []
        },
        {
            id: 'quickpi_buzzer',
            name: 'Buzzer',
            url: 'https://static4.castor-informatique.fr/help/quickpi.html#quickpi_buzzer',
            language: 'all',
            order: 200,
            python: ['setBuzzerState', 'setBuzzerNote','turnBuzzerOn','turnBuzzerOff']
        },
        {
            id: 'quickpi_led',
            name: 'LEDs',
            url: 'https://static4.castor-informatique.fr/help/quickpi.html#quickpi_led',
            language: 'all',
            order: 201,
            python: ['setLedState','toggleLedState','turnLedOn','turnLedOff']
        },
        {
            id: 'quickpi_button',
            name: 'Boutons et manette',
            url: 'https://static4.castor-informatique.fr/help/quickpi.html#quickpi_button',
            language: 'all',
            order: 202,
            python: ['isButtonPressed', 'isButtonPressedWithName']
        },  
        {   
            id: 'quickpi_screen',
            name: 'Écran',
            url: 'https://static4.castor-informatique.fr/help/quickpi.html#quickpi_screen',
            language: 'all',
            order: 203,
            python: ['displayText']
        },
        {
            id: 'quickpi_range',
            name: 'Capteur de distance',
            url: 'https://static4.castor-informatique.fr/help/quickpi.html#quickpi_range',
            language: 'all',
            order: 204,
            python: ['readDistance']
        },
        {
            id: 'quickpi_servo',
            name: 'Servomoteur',
            url: 'https://static4.castor-informatique.fr/help/quickpi.html#quickpi_servo',
            language: 'all',
            order: 205,
            python: ['setServoAngle', 'getServoAngle']
        },
        {
            id: 'quickpi_thermometer',
            name: 'Thermomètre',
            url: 'https://static4.castor-informatique.fr/help/quickpi.html#quickpi_thermometer',
            language: 'all',
            order: 206,
            python: ['readTemperature']
        },
        {
            id: 'quickpi_microphone',
            name: 'Microphone',
            url: 'https://static4.castor-informatique.fr/help/quickpi.html#quickpi_microphone',
            language: 'all',
            order: 207,
            python: ['readSoundLevel']
        },
        {
            id: 'quickpi_light_sensor',
            name: 'Capteur de luminosité',
            url: 'https://static4.castor-informatique.fr/help/quickpi.html#quickpi_light_sensor',
            language: 'all',
            order: 208,
            python: ['readLightIntensity']
        },
        {
            id: 'quickpi_accelerometer',
            name: 'Accéléromètre',
            url: 'https://static4.castor-informatique.fr/help/quickpi.html#quickpi_accelerometer',
            language: 'all',
            order: 209,
            python: ['readAcceleration']
        },  
        {
            id: 'quickpi_wait',
            name: 'Gestion du temps',
            url: 'https://static4.castor-informatique.fr/help/quickpi.html#quickpi_wait',
            language: 'all',
            order: 250,
            python: ['sleep']
        }
        ];



    var boardDefinitions = [
        {
            name: "grovepi",
            friendlyName: "Grove Base Hat for Raspberry Pi",
            image: "grovepihat.png",
            adc: "grovepi",
            portTypes: {
                "D": [5, 16, 18, 22, 24, 26],
                "A": [0, 2, 4, 6],
                "i2c": ["i2c"],
            },
            default: [
                { type: "screen", suggestedName: "screen1", port: "i2c", subType: "16x2lcd" },
                { type: "led", suggestedName: "led1", port: 'D5', subType: "blue" },
                { type: "servo", suggestedName: "servo1", port: "D16" },
                { type: "range", suggestedName: "range1", port :"D18", subType: "ultrasonic"},
                { type: "button", suggestedName: "button1", port: "D22" },
                { type: "humidity", suggestedName: "humidity1", port: "D24"},
                { type: "buzzer", suggestedName: "buzzer1", port: "D26", subType: "active"},
                { type: "temperature", suggestedName: "temperature1", port: 'A0', subType: "groveanalog" },
                { type: "potentiometer", suggestedName: "potentiometer1", port :"A4"},
                { type: "light", suggestedName: "light1", port :"A6"},
            ]
        },
        {
            name: "quickpi",
            friendlyName: "France IOI QuickPi Hat",
            image: "quickpihat.png",
            adc: "ads1015",
            portTypes: {
                "D": [5, 16, 24],
                "A": [0],
            },
            builtinSensors: [
                { type: "screen", subType: "oled128x32", port: "i2c",  suggestedName: "screen1", },
                { type: "led", subType: "red", port: "D4", suggestedName: "led1", },
                { type: "led", subType: "green", port: "D17", suggestedName: "led2", },
                { type: "led", subType: "blue", port: "D27",  suggestedName: "led3", },
                { type: "irtrans", port: "D22",  suggestedName: "infraredtransmiter1", },
                { type: "irrecv", port: "D23", suggestedName: "infraredreceiver1", },
                { type: "sound", port: "A1", suggestedName: "microphone1", },
                { type: "buzzer", subType: "passive", port: "D12", suggestedName: "buzzer1", },
                { type: "accelerometer", subType: "BMI160", port: "i2c", suggestedName: "accelerometer1", },
                { type: "gyroscope", subType: "BMI160", port: "i2c", suggestedName: "gryscope1", },
                { type: "magnetometer", subType: "LSM303C", port: "i2c", suggestedName: "magnetometer1", },
                { type: "temperature", subType: "BMI160", port: "i2c", suggestedName: "temperature1", },
                { type: "range", subType: "vl53l0x", port: "i2c", suggestedName: "distance1", },
                { type: "button", port: "D26", suggestedName: "button1", },
                { type: "light", port: "A2", suggestedName: "light1", },
                { type: "stick", port: "D7", suggestedName: "stick1", }
            ],
        },
        {
            name: "pinohat",
            image: "pinohat.png",
            friendlyName: "Raspberry Pi without hat",
            adc: ["ads1015", "none"],
            portTypes: {
                "D": [5, 16, 24],
                "A": [0],
                "i2c": ["i2c"],
            },
        }
    ]


    var sensorDefinitions = [
        /******************************** */
        /*             Actuators          */
        /**********************************/
        {
            name: "led",
            description: "LED",
            isAnalog: false,
            isSensor: false,
            portType: "D",
            getInitialState: function (sensor) {
                return false;
            },
            selectorImages: ["ledon-red.png"],
            valueType: "boolean",
            pluggable: true,
            getPercentageFromState: function (state) {
                if (state)
                    return 1;
                else
                    return 0;
            },
            getStateFromPercentage: function (percentage) {
                if (percentage)
                    return 1;
                else
                    return 0;
            },
            setLiveState: function (sensor, state, callback) {
                var ledstate = state ? 1 : 0;
                var command = "setLedState(\"" + sensor.name + "\"," + ledstate + ")";

                context.quickPiConnection.sendCommand(command, callback);
            },
            getStateString: function(state) {
                return state ? "ON" : "OFF";
            },
            subTypes: [{
                subType: "blue",
                description: "LED bleue",
                selectorImages: ["ledon-blue.png"],
                suggestedName: "blueled",
            },
            {
                subType: "green",
                description: "LED verte",
                selectorImages: ["ledon-green.png"],
                suggestedName: "greenled",
            },
            {
                subType: "orange",
                description: "LED orange",
                selectorImages: ["ledon-orange.png"],
                suggestedName: "orangeled",
            },
            {
                subType: "red",
                description: "LED rouge",
                selectorImages: ["ledon-red.png"],
                suggestedName: "redled",
            }
            ],
        },
        {
            name: "buzzer",
            description: "Buzzer",
            isAnalog: false,
            isSensor: false,
            getInitialState: function(sensor) {
                return false;
            },
            portType: "D",
            selectorImages: ["buzzer-ringing.png"],
            valueType: "boolean",
            getPercentageFromState: function (state, sensor) {

                if (sensor.showAsAnalog)
                {
                    return state / (sensor.maxAnalog - sensor.minAnalog);
                } else {
                    if (state)
                        return 1;
                    else
                        return 0;
                }
            },
            getStateFromPercentage: function (percentage) {
                if (percentage)
                    return 1;
                else
                    return 0;
            },
            setLiveState: function (sensor, state, callback) {
                var ledstate = state ? 1 : 0;
                var command = "setBuzzerState(\"" + sensor.name + "\"," + ledstate + ")";

                context.quickPiConnection.sendCommand(command, callback);
            },
            getStateString: function(state) {

                if(typeof state == 'number' && 
                    state != 1 &&
                    state != 0) {

                        return state.toString() + "Hz";
                }               
                return state ? "ON" : "OFF";
            },
            subTypes: [{
                subType: "active",
                description: "Grove Buzzer",
                pluggable: true,
            },
            {
                subType: "passive",
                description: "Quick Pi Passive Buzzer",
            }],
        },
        {
            name: "servo",
            description: "Servo motor",
            isAnalog: true,
            isSensor: false,
            getInitialState: function(sensor) {
                return 0;
            },
            portType: "D",
            valueType: "number",
            pluggable: true,
            valueMin: 0,
            valueMax: 180,
            selectorImages: ["servo.png", "servo-pale.png", "servo-center.png"],
            getPercentageFromState: function (state) {
                return state / 180;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 180);
            },
            setLiveState: function (sensor, state, callback) {
                var command = "setServoAngle(\"" + sensor.name + "\"," + state + ")";

                context.quickPiConnection.sendCommand(command, callback);
            },
            getStateString: function(state) {
                return "" + state + "°";
            }
        },
        {
            name: "screen",
            description: "Screen",
            isAnalog: false,
            isSensor: false,
            getInitialState: function(sensor) {
                if (sensor.isDrawingScreen)
                    return null;
                else
                    return {line1: "", line2: ""};
            },
            cellsAmount: function(paper) {
                if(context.board == 'grovepi') {
                    return 2;
                }
                if(paper.width < 250) {
                    return 4;
                } else if(paper.width < 350) {
                    return 3;
                }
                return 2;
            },
            portType: "i2c",
            valueType: "object",
            selectorImages: ["screen.png"],
            compareState: function (state1, state2) {
                // Both are null are equal
                if (state1 == null && state2 == null)
                    return true;

                // If only one is null they are different
                if ((state1 == null && state2) ||
                    (state1 && state2 == null))
                    return false;

                if (state1 && state1.isDrawingData) {
                    return screenDrawing.compareStates(state1, state2);
                } else {

                    // Otherwise compare the strings
                    return (state1.line1 == state2.line1) &&
                                ((state1.line2 == state2.line2) ||
                                (!state1.line2 && !state2.line2));
                }
            },
            setLiveState: function (sensor, state, callback) {
                var line2 = state.line2;
                if (!line2)
                    line2 = "";

                var command = "displayText(\"" + sensor.name + "\"," + state.line1 + "\", \"" + line2 + "\")";

                context.quickPiConnection.sendCommand(command, callback);
            },
            getStateString: function(state) {
                if(!state) { return '""'; }
                
                if (state.isDrawingData)
                    return strings.messages.drawing;
                else
                    return '"' + state.line1 + (state.line2 ? " / " + state.line2 : "") + '"';
            },
            getWrongStateString: function(failInfo) {
                if(!failInfo.expected.isDrawingData || !failInfo.actual.isDrawingData) {
                    return null; // Use default message
                }
                var data1 = failInfo.expected.data;
                var data2 = failInfo.actual.data;
                var nbDiff = 0;
                for (var i = 0; i < data1.length; i++) {
                    if(data1[i] != data2[i]) {
                        nbDiff += 1;
                    }
                }
                return strings.messages.wrongStateDrawing.format(failInfo.name, nbDiff, failInfo.time);
            },
            subTypes: [{
                subType: "16x2lcd",
                description: "Grove 16x2 LCD",
                pluggable: true,
            },
            {
                subType: "oled128x32",
                description: "128x32 Oled Screen",
            }],

        },
        {
            name: "irtrans",
            description: "IR Transmiter",
            isAnalog: true,
            isSensor: true,
            portType: "D",
            valueType: "number",
            valueMin: 0,
            valueMax: 60,
            selectorImages: ["irtranson.png"],
            getPercentageFromState: function (state) {
                return state / 60;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 60);
            },
            setLiveState: function (sensor, state, callback) {
                var ledstate = state ? 1 : 0;
                var command = "setInfraredState(\"" + sensor.name + "\"," + ledstate + ")";

                context.quickPiConnection.sendCommand(command, callback);
            },
        },
        /******************************** */
        /*             sensors            */
        /**********************************/
        {
            name: "button",
            description: "Button",
            isAnalog: false,
            isSensor: true,
            portType: "D",
            valueType: "boolean",
            pluggable: true,
            selectorImages: ["buttonoff.png"],
            getPercentageFromState: function (state) {
                if (state)
                    return 1;
                else
                    return 0;
            },
            getStateFromPercentage: function (percentage) {
                if (percentage)
                    return 1;
                else
                    return 0;
            },
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("buttonStateInPort(\"" + sensor.name + "\")", function (retVal) {
                    var intVal = parseInt(retVal, 10);
                    callback(intVal != 0);
                });
            },
        },
        {
            name: "stick",
            description: "5 way button",
            isAnalog: false,
            isSensor: true,
            portType: "D",
            valueType: "boolean",
            selectorImages: ["stick.png"],
            gpiosNames: ["up", "down", "left", "right", "center"],
            gpios: [10, 9, 11, 8, 7],
            getPercentageFromState: function (state) {
                if (state)
                    return 1;
                else
                    return 0;
            },
            getStateFromPercentage: function (percentage) {
                if (percentage)
                    return 1;
                else
                    return 0;
            },
            compareState: function (state1, state2) {
                if (state1 == null && state2 == null)
                    return true;

                return state1[0] == state2[0] &&
                        state1[1] == state2[1] &&
                        state1[2] == state2[2] &&
                        state1[3] == state2[3] &&
                        state1[4] == state2[4];
            },
            getLiveState: function (sensor, callback) {
                var cmd = "readStick(" + this.gpios.join() + ")";

                context.quickPiConnection.sendCommand("readStick(" + this.gpios.join() + ")", function (retVal) {
                    var array = JSON.parse(retVal);
                    callback(array);
                });
            },
            getButtonState: function(buttonname, state) {
                if (state) {
                    var buttonparts = buttonname.split(".");
                    var actualbuttonmame = buttonname;
                    if (buttonparts.length == 2) {
                        actualbuttonmame = buttonparts[1];
                    }

                    var index = this.gpiosNames.indexOf(actualbuttonmame);

                    if (index >= 0) {
                        return state[index];
                    }
                }

                return false;
            }
        },
        {
            name: "temperature",
            description: "Temperature sensor",
            isAnalog: true,
            isSensor: true,
            portType: "A",
            valueType: "number",
            valueMin: 0,
            valueMax: 60,
            selectorImages: ["temperature-hot.png", "temperature-overlay.png"],
            getPercentageFromState: function (state) {
                return state / 60;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 60);
            },
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readTemperature(\"" + sensor.name + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
            subTypes: [{
                subType: "groveanalog",
                description: "Grove Analog tempeature sensor",
                portType: "A",
                pluggable: true,
            },
            {
                subType: "BMI160",
                description: "Quick Pi Accelerometer+Gyroscope temperature sensor",
                portType: "i2c",
            },
            {
                subType: "DHT11",
                description: "DHT11 Tempeature Sensor",
                portType: "D",
                pluggable: true,
            }],
        },
        {
            name: "potentiometer",
            description: "Potentiometer",
            isAnalog: true,
            isSensor: true,
            portType: "A",
            valueType: "number",
            pluggable: true,
            valueMin: 0,
            valueMax: 100,
            selectorImages: ["potentiometer.png", "potentiometer-pale.png"],
            getPercentageFromState: function (state) {
                return state / 100;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 100);
            },
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readRotaryAngle(\"" + sensor.name + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
        },
        {
            name: "light",
            description: "Light sensor",
            isAnalog: true,
            isSensor: true,
            portType: "A",
            valueType: "number",
            pluggable: true,
            valueMin: 0,
            valueMax: 100,
            selectorImages: ["light.png"],
            getPercentageFromState: function (state) {
                return state / 100;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 100);
            },
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readLightIntensity(\"" + sensor.name + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
        },
        {
            name: "range",
            description: "Capteur de distance",
            isAnalog: true,
            isSensor: true,
            portType: "D",
            valueType: "number",
            valueMin: 0,
            valueMax: 5000,
            selectorImages: ["range.png"],
            getPercentageFromState: function (state) {
                return state / 500;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 500);
            },
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readDistance(\"" + sensor.name + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
            subTypes: [{
                subType: "vl53l0x",
                description: "Time of flight distance sensor",
                portType: "i2c",
            },
            {
                subType: "ultrasonic",
                description: "Capteur de distance à ultrason",
                portType: "D",
                pluggable: true,
            }],

        },
        {
            name: "humidity",
            description: "Humidity sensor",
            isAnalog: true,
            isSensor: true,
            portType: "D",
            valueType: "number",
            pluggable: true,
            valueMin: 0,
            valueMax: 100,
            selectorImages: ["humidity.png"],
            getPercentageFromState: function (state) {
                return state / 100;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 100);
            },
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readHumidity(\"" + sensor.name + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
        },
        {
            name: "sound",
            description: "Sound sensor",
            isAnalog: true,
            isSensor: true,
            portType: "A",
            valueType: "number",
            pluggable: true,
            valueMin: 0,
            valueMax: 100,
            selectorImages: ["sound.png"],
            getPercentageFromState: function (state) {
                return state / 100;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 100);
            },
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readSoundLevel(\"" + sensor.name + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
        },
        {
            name: "accelerometer",
            description: "Accelerometer sensor (BMI160)",
            isAnalog: true,
            isSensor: true,
            portType: "i2c",
            valueType: "object",
            valueMin: 0,
            valueMax: 100,
            step: 0.1,
            selectorImages: ["accel.png"],
            getStateString: function (state) {
                if (state == null)
                    return "0m/s²";

                if (Array.isArray(state))
                {
                    return "X: " + state[0] + "m/s² Y: " + state[1] + "m/s² Z: " + state[2] + "m/s²";
                }
                else {
                    return state.toString() + "m/s²";
                }
            },
            getPercentageFromState: function (state) {
                return ((state + 78.48) / 156.96);
            },
            getStateFromPercentage: function (percentage) {
                var value = ((percentage * 156.96) - 78.48);
                return parseFloat(value.toFixed(1));
            },
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readAccelBMI160()", function(val) {
                    var array = JSON.parse(val);
                    callback(array);
                });
            },
        },
        {
            name: "gyroscope",
            description: "Gyropscope sensor (BMI160)",
            isAnalog: true,
            isSensor: true,
            portType: "i2c",
            valueType: "object",
            valueMin: 0,
            valueMax: 100,
            selectorImages: ["gyro.png"],
            getPercentageFromState: function (state) {
                return (state + 125) / 250;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 250) - 125;
            },
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readGyroBMI160()", function(val) {

                    var array = JSON.parse(val);
                    array[0] = Math.round(array[0]);
                    array[1] = Math.round(array[1]);
                    array[2] = Math.round(array[2]);
                    callback(array);
                });
            },
        },
        {
            name: "magnetometer",
            description: "Magnetometer sensor (LSM303C)",
            isAnalog: true,
            isSensor: true,
            portType: "i2c",
            valueType: "object",
            valueMin: 0,
            valueMax: 100,
            selectorImages: ["mag.png"],
            getPercentageFromState: function (state) {
                return (state + 1600) / 3200;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 3200) - 1600;
            },
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readMagnetometerLSM303C(False)", function(val) {

                    var array = JSON.parse(val);

                    array[0] = Math.round(array[0]);
                    array[1] = Math.round(array[1]);
                    array[2] = Math.round(array[2]);

                    callback(array);
                });
            },
        },
        {
            name: "irrecv",
            description: "IR Receiver",
            isAnalog: true,
            isSensor: true,
            portType: "D",
            valueType: "number",
            valueMin: 0,
            valueMax: 60,
            selectorImages: ["irrecvon.png"],
            getPercentageFromState: function (state) {
                return state / 60;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 60);
            },
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("buttonStateInPort(\"" + sensor.name + "\")", function (retVal) {
                    var intVal = parseInt(retVal, 10);
                    callback(intVal == 0);
                });
            },
        },
    ];



    function findSensorDefinition(sensor) {
        var sensorDef = null;
        for (var iType = 0; iType < sensorDefinitions.length; iType++) {
            var type = sensorDefinitions[iType];

            if (sensor.type == type.name) {
                if (sensor.subType && type.subTypes) {

                    for (var iSubType = 0; iSubType < type.subTypes.length; iSubType++) {
                        var subType = type.subTypes[iSubType];

                        if (subType.subType == sensor.subType) {
                            sensorDef = $.extend({}, type, subType);
                        }
                    }
                } else {
                    sensorDef = type;
                }
            }
        }

        if(sensorDef && !sensorDef.compareState) {
            sensorDef.compareState = function(state1, state2) {
                return state1 == state2;
            };
        }

        return sensorDef;
    }

    var defaultQuickPiOptions = {
        disableConnection: false,
        increaseTimeAfterCalls: 5
        };
    function getQuickPiOption(name) {
        if(name == 'disableConnection') {
            // TODO :: Legacy, remove when all tasks will have been updated
            return (context.infos
                && (context.infos.quickPiDisableConnection
                || (context.infos.quickPi && context.infos.quickPi.disableConnection)));
        }
        if(context.infos && context.infos.quickPi && typeof context.infos.quickPi[name] != 'undefined') {
            return context.infos.quickPi[name];
        } else {
            return defaultQuickPiOptions[name];
        }
    }

    function getWrongStateText(failInfo) {
        var actualStateStr = "" + failInfo.actual;
        var expectedStateStr = "" + failInfo.expected;
        var sensorDef = findSensorDefinition(failInfo.sensor);
        if(sensorDef) {
            if(sensorDef.isSensor) {
                return strings.messages.wrongStateSensor.format(failInfo.name, failInfo.time);
            }
            if(sensorDef.getWrongStateString) {
                var sensorWrongStr = sensorDef.getWrongStateString(failInfo);
                if(sensorWrongStr) {
                    return sensorWrongStr;
                }
            }
            if(sensorDef.getStateString) {
                actualStateStr = sensorDef.getStateString(failInfo.actual);
                expectedStateStr = sensorDef.getStateString(failInfo.expected);
            }
        }
        return strings.messages.wrongState.format(failInfo.name, actualStateStr, expectedStateStr, failInfo.time);
    }

    function getCurrentBoard() {
        var found = boardDefinitions.find(function (element) {
            if (context.board == element.name)
                return element;
        });

        return found;
    }

    function getSessionStorage(name) {
        // Use a try in case it gets blocked
        try {
            return sessionStorage[name];
        } catch(e) {
            return null;
        }
    }

    function setSessionStorage(name, value) {
        // Use a try in case it gets blocked
        try {
            sessionStorage[name] = value;
        } catch(e) {}
    }

    if(window.getQuickPiConnection) {
        var lockstring = getSessionStorage('lockstring');
        if(!lockstring) {
            lockstring = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            setSessionStorage('lockstring', lockstring);
        }

        context.quickPiConnection = getQuickPiConnection(lockstring, raspberryPiConnected, raspberryPiDisconnected, raspberryPiChangeBoard);
    }

    var paper;
    context.offLineMode = true;

    context.onExecutionEnd = function () {
        if (context.autoGrading)
        {
            buzzerSound.stopAll();
        }

    };

    infos.checkEndEveryTurn = true;
    infos.checkEndCondition = function (context, lastTurn) {

        if (!context.display && !context.autoGrading) {
            context.success = true;
            throw (strings.messages.manualTestSuccess);
        }

        var testEnded = lastTurn || context.currentTime > context.maxTime;

        if (context.autoGrading) {
            if (!testEnded) { return; }

            if (lastTurn && context.display && !context.loopsForever) {
                context.currentTime = Math.floor(context.maxTime * 1.05);
                drawNewStateChanges();
                drawCurrentTime();
            }

            var failInfo = null;

            for(var sensorName in context.gradingStatesBySensor) {
                // Cycle through each sensor from the grading states
                var sensor = findSensorByName(sensorName);
                var sensorDef = findSensorDefinition(sensor);

                var expectedStates = context.gradingStatesBySensor[sensorName];
                if(!expectedStates.length) { continue;}

                var actualStates = context.actualStatesBySensor[sensorName];
                var actualIdx = 0;

                // Check that we went through all expected states
                for (var i = 0; i < context.gradingStatesBySensor[sensorName].length; i++) {
                    var expectedState = context.gradingStatesBySensor[sensorName][i];

                    if(expectedState.hit) { continue; } // Was hit, valid
                    var newFailInfo = null;
                    if(actualStates) {
                        // Scroll through actual states until we get the state at this time
                        while(actualIdx + 1 < actualStates.length && actualStates[actualIdx+1].time <= expectedState.time) {
                            actualIdx += 1;
                        }
                        if(!sensorDef.compareState(actualStates[actualIdx].state, expectedState.state)) {
                            newFailInfo = {
                                sensor: sensor,
                                name: sensorName,
                                time: expectedState.time,
                                expected: expectedState.state,
                                actual: actualStates[actualIdx].state
                            };
                        }
                    } else {
                        // No actual states to compare to
                        newFailInfo = {
                            sensor: sensor,
                            name: sensorName,
                            time: expectedState.time,
                            expected: expectedState.state,
                            actual: null
                        };
                    }

                    if(newFailInfo) {
                        // Only update failInfo if we found an error earlier
                        failInfo = failInfo && failInfo.time < newFailInfo.time ? failInfo : newFailInfo;
                    }
                }

                // Check that no actual state conflicts an expected state
                if(!actualStates) { continue; }
                var expectedIdx = 0;
                for(var i = 0; i < actualStates.length ; i++) {
                    var actualState = actualStates[i];
                    while(expectedIdx + 1 < expectedStates.length && expectedStates[expectedIdx+1].time <= actualState.time) {
                        expectedIdx += 1;
                    }
                    if(!sensorDef.compareState(actualState.state, expectedStates[expectedIdx].state)) {
                        // Got an unexpected state change
                        var newFailInfo = {
                            sensor: sensor,
                            name: sensorName,
                            time: actualState.time,
                            expected: expectedStates[expectedIdx].state,
                            actual: actualState.state
                        };
                        failInfo = failInfo && failInfo.time < newFailInfo.time ? failInfo : newFailInfo;
                    }
                }
            }

            if(failInfo) {
                // Missed expected state
                context.success = false;
                throw (getWrongStateText(failInfo));
            } else {
                // Success
                context.success = true;
                throw (strings.messages.programEnded);
            }
        } else {
            if (!context.offLineMode) {
                $('#piinstallcheck').hide();
            }

            if (lastTurn) {
                context.success = true;
                throw (strings.messages.programEnded);
            }
        }
   };

   context.generatePythonSensorTable = function()
   {
        var pythonSensorTable = "sensorTable = [";
        var first = true;

        for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
            var sensor = infos.quickPiSensors[iSensor];
            if (first) {
                first = false;
            } else {
                pythonSensorTable += ",";
            }

            if (sensor.type == "stick") {
                var stickDefinition = findSensorDefinition(sensor);
                var firststick = true;

                for (var iStick = 0; iStick < stickDefinition.gpiosNames.length; iStick++) {
                    var name = sensor.name + "." + stickDefinition.gpiosNames[iStick];
                    var port = "D" + stickDefinition.gpios[iStick];

                    if (firststick) {
                        firststick = false;
                    } else {
                        pythonSensorTable += ",";
                    }

                    pythonSensorTable += "{\"type\":\"button\"";
                    pythonSensorTable += ",\"name\":\"" + name + "\"";
                    pythonSensorTable += ",\"port\":\"" + port + "\"}";
                }
            } else {
                pythonSensorTable += "{\"type\":\"" + sensor.type + "\"";
                pythonSensorTable += ",\"name\":\"" + sensor.name + "\"";
                pythonSensorTable += ",\"port\":\"" + sensor.port + "\"";
                if (sensor.subType)
                    pythonSensorTable += ",\"subType\":\"" + sensor.subType + "\"";

                pythonSensorTable += "}";
            }
        }

        var board = getCurrentBoard();
        pythonSensorTable += "]; currentADC = \"" + board.adc + "\"";

        return pythonSensorTable;
   }

    context.resetSensorTable = function()
    {
        var pythonSensorTable = context.generatePythonSensorTable();

        context.quickPiConnection.sendCommand(pythonSensorTable, function(x) {});
    }


    context.findSensor = function findSensor(type, port, error=true) {
        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];

            if (sensor.type == type && sensor.port == port)
                return sensor;
        }

        if (error) {
            context.success = false;
            throw (strings.messages.sensorNotFound.format('type ' + type + ', port ' + port));
        }

        return null;
    }


    function sensorAssignPort(sensor)
    {
        var board = getCurrentBoard();
        var sensorDefinition = findSensorDefinition(sensor);

        sensor.port = null;

        // first try with built ins
        if (board.builtinSensors) {
            for (var i = 0; i < board.builtinSensors.length; i++) {
                var builtinsensor = board.builtinSensors[i];

                // Search for the specified subtype 
                if (builtinsensor.type == sensor.type && 
                    builtinsensor.subType == sensor.subType &&
                    !context.findSensor(builtinsensor.type, builtinsensor.port, false))
                {
                    sensor.port = builtinsensor.port;
                    return;
                }
            }

            // Search without subtype
            for (var i = 0; i < board.builtinSensors.length; i++) {
                var builtinsensor = board.builtinSensors[i];

                // Search for the specified subtype 
                if (builtinsensor.type == sensor.type && 
                    !context.findSensor(builtinsensor.type, builtinsensor.port, false))
                {
                    sensor.port = builtinsensor.port;
                    sensor.subType = builtinsensor.subType;
                    return;
                }
            }


            // If this is a button try to set it to a stick
            if (!sensor.port && sensor.type == "button") {
                for (var i = 0; i < board.builtinSensors.length; i++) {
                    var builtinsensor = board.builtinSensors[i];
                    if (builtinsensor.type == "stick")
                    {
                        sensor.port = builtinsensor.port;
                        return;
                    }
                }
            }
        }


        // Second try assign it a grove port
        if (!sensor.port) {
            var sensorDefinition = findSensorDefinition(sensor);
            var pluggable = sensorDefinition.pluggable;

            if (sensorDefinition.subTypes) {
                for (var iSubTypes = 0; iSubTypes < sensorDefinition.subTypes.length; iSubTypes++) {
                    var subTypeDefinition = sensorDefinition.subTypes[iSubTypes];
                    if (pluggable || subTypeDefinition.pluggable) {
                        var ports = board.portTypes[sensorDefinition.portType];
                        for (var iPorts = 0; iPorts < ports.length; iPorts++) {
                            var port = sensorDefinition.portType;
                            if (sensorDefinition.portType != "i2c")
                                port = sensorDefinition.portType + ports[iPorts];
                            if (!findSensorByPort(port)) {
                                sensor.port = port;

                                if (!sensor.subType)
                                    sensor.subType = subTypeDefinition.subType;
                                return;
                            }
                        }
                    }
                }
            } else {
                if (pluggable) {
                    var ports = board.portTypes[sensorDefinition.portType];
                    for (var iPorts = 0; iPorts < ports.length; iPorts++) {
                        var port = sensorDefinition.portType + ports[iPorts];
                        if (!findSensorByPort(port)) {
                            sensor.port = port;
                            return;
                        }
                    }
                }
            }
        }
    }

    context.reset = function (taskInfos) {
        buzzerSound.stopAll();

        if (!context.offLineMode) {
            $('#piinstallcheck').hide();
            context.quickPiConnection.startNewSession();
            context.resetSensorTable();
        }

        context.currentTime = 0;
        if (taskInfos != undefined) {
            context.actualStatesBySensor = {};
            context.tickIncrease = 100;
            context.autoGrading = taskInfos.autoGrading;
            context.loopsForever = taskInfos.loopsForever;
            context.allowInfiniteLoop = !context.autoGrading;
            if (context.autoGrading) {
                context.maxTime = 0;

                if (taskInfos.input)
                {
                    for (var i = 0; i < taskInfos.input.length; i++)
                    {
                        taskInfos.input[i].input = true;
                    }
                    context.gradingStatesByTime = taskInfos.input.concat(taskInfos.output);
                }
                else {
                    context.gradingStatesByTime = taskInfos.output;
                }

                // Copy states to avoid modifying the taskInfos states
                context.gradingStatesByTime = context.gradingStatesByTime.map(
                    function(val) {
                        return Object.assign({}, val);
                    });

                context.gradingStatesByTime.sort(function (a, b) { return a.time - b.time; });

                context.gradingStatesBySensor = {};

                for (var i = 0; i < context.gradingStatesByTime.length; i++) {
                    var state = context.gradingStatesByTime[i];

                    if (!context.gradingStatesBySensor.hasOwnProperty(state.name))
                        context.gradingStatesBySensor[state.name] = [];

                    context.gradingStatesBySensor[state.name].push(state);
//                    state.hit = false;
//                    state.badonce = false;

                    if (state.time > context.maxTime)
                        context.maxTime = state.time;
                }


                for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
                    var sensor = infos.quickPiSensors[iSensor];
                    
                    if (sensor.type == "buzzer") {
                        var states = context.gradingStatesBySensor[sensor.name];

                        if (states) {
                            for (var iState = 0; iState < states.length; iState++) {
                                var state = states[iState].state;
                                
                                if (typeof state == 'number' &&
                                        state != 0 &&
                                        state != 1) {
                                    sensor.showAsAnalog = true;
                                    break;
                                }
                            }
                        }
                    }

                    var isAnalog = findSensorDefinition(sensor).isAnalog || sensor.showAsAnalog;

                    if (isAnalog) {
                        sensor.maxAnalog = Number.MIN_VALUE;
                        sensor.minAnalog = Number.MAX_VALUE;

                        if (context.gradingStatesBySensor.hasOwnProperty(sensor.name)) {
                            var states = context.gradingStatesBySensor[sensor.name];

                            for (var iState = 0; iState < states.length; iState++) {
                                var state = states[iState];

                                if (state.state > sensor.maxAnalog)
                                    sensor.maxAnalog = state.state;
                                if (state.state < sensor.minAnalog)
                                    sensor.minAnalog = state.state;
                            }
                        }
                    }

                    if (sensor.type == "screen") {
                        var states = context.gradingStatesBySensor[sensor.name];

                        if (states) {
                            for (var iState = 0; iState < states.length; iState++) {
                                var state = states[iState];
                                if (state.state.isDrawingData)
                                    sensor.isDrawingScreen = true;
                            }
                        }
                    }
                }
            }


            if (infos.quickPiSensors == "default")
            {
                infos.quickPiSensors = [];
                addDefaultBoardSensors();
            }
        }

        context.success = false;
        if (context.autoGrading)
            context.doNotStartGrade = false;
        else
            context.doNotStartGrade = true;

        for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
            var sensor = infos.quickPiSensors[iSensor];

            sensor.state = null;
            sensor.screenDrawing = null;
            sensor.lastDrawnTime = 0;
            sensor.lastDrawnState = null;
            sensor.callsInTimeSlot = 0;
            sensor.lastTimeIncrease = 0;
            sensor.removed = false;

            // If the sensor has no port assign one
            if (!sensor.port) {
                sensorAssignPort(sensor);
            }

            // Set initial state
            var sensorDef = findSensorDefinition(sensor);
            if(sensorDef && !sensorDef.isSensor) {
                context.registerQuickPiEvent(sensor.name, sensorDef.getInitialState(sensor), true, true);
            }
        }

        if (context.display) {
            context.resetDisplay();
        } else {

            context.success = false;
        }

        context.timeLineStates = [];

        startSensorPollInterval();
    };

    function clearSensorPollInterval() {
        if(context.sensorPollInterval) {
            clearInterval(context.sensorPollInterval);
            context.sensorPollInterval = null;
        }
    };

    function startSensorPollInterval() {
        // Start polling the sensors on the raspberry if the raspberry is connected

        clearSensorPollInterval();

        context.liveUpdateCount = 0;

        if(!context.quickPiConnection.isConnected()) { return; }

        context.sensorPollInterval = setInterval(function () {
            if((context.runner && context.runner.isRunning())
                || context.offLineMode
                || context.liveUpdateCount != 0) { return; }

            context.quickPiConnection.startTransaction();

            for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
                var sensor = infos.quickPiSensors[iSensor];

                updateLiveSensor(sensor);
            }

            context.quickPiConnection.endTransaction();
        }, 200);
    };

    function updateLiveSensor(sensor) {
        if (findSensorDefinition(sensor).isSensor && findSensorDefinition(sensor).getLiveState) {
            context.liveUpdateCount++;

            //console.log("updateLiveSensor " + sensor.name, context.liveUpdateCount);

            findSensorDefinition(sensor).getLiveState(sensor, function (returnVal) {
                context.liveUpdateCount--;

                //console.log("updateLiveSensor callback" + sensor.name, context.liveUpdateCount);

                if (!sensor.removed) {
                    sensor.state = returnVal;
                    drawSensor(sensor);
                }
            });
        }
    }

    context.changeBoard = function(newboardname)
    {
        if (context.board == newboardname)
            return;

        var board = null;
        for (var i = 0; i < boardDefinitions.length; i++) {
            board = boardDefinitions[i];

            if (board.name == newboardname)
                break;
        }

        if (board == null)
            return;

        context.board = newboardname;
        setSessionStorage('board', newboardname);

        if (infos.customSensors) {
            for (var i = 0; i < infos.quickPiSensors.length; i++) {
                var sensor = infos.quickPiSensors[i];
                sensor.removed = true;
            }
            infos.quickPiSensors = [];

            if (board.builtinSensors) {
                for (var i = 0; i < board.builtinSensors.length; i++) {
                    var sensor = board.builtinSensors[i];

                    var newSensor = {
                        "type": sensor.type,
                        "port": sensor.port,
                        "builtin": true,
                    };

                    if (sensor.subType) {
                        newSensor.subType = sensor.subType;
                    }

                    newSensor.name = getSensorSuggestedName(sensor.type, sensor.suggestedName);

                    sensor.state = null;
                    sensor.callsInTimeSlot = 0;
                    sensor.lastTimeIncrease = 0;

                    infos.quickPiSensors.push(newSensor);
                }
            }
        } else {
            for (var i = 0; i < infos.quickPiSensors.length; i++) {
                var sensor = infos.quickPiSensors[i];
                sensorAssignPort(sensor);
            }
        }

        context.resetSensorTable();
        context.resetDisplay();
    };



    context.board = "quickpi";

    if (getSessionStorage('board'))
        context.changeBoard(getSessionStorage('board'))

    context.savePrograms = function(xml) {
        if (context.infos.customSensors)
        {
            var node = goog.dom.createElement("quickpi");
            xml.appendChild(node);

            for (var i = 0; i < infos.quickPiSensors.length; i++) {
                var currentSensor = infos.quickPiSensors[i];

                var node = goog.dom.createElement("sensor");

                node.setAttribute("type", currentSensor.type);
                node.setAttribute("port", currentSensor.port);
                node.setAttribute("name", currentSensor.name);

                if (currentSensor.subType)
                    node.setAttribute("subtype", currentSensor.subType);

                var elements = xml.getElementsByTagName("quickpi");

                elements[0].appendChild(node);
            }
        }
    }

    context.loadPrograms = function(xml) {
        if (context.infos.customSensors) {
            var elements = xml.getElementsByTagName("sensor");

            if (elements.length > 0) {
                for (var i = 0; i < infos.quickPiSensors.length; i++) {
                    var sensor = infos.quickPiSensors[i];
                    sensor.removed = true;
                }
                infos.quickPiSensors = [];

                for (var i = 0; i < elements.length; i++) {
                    var sensornode = elements[i];
                    var sensor = {
                        "type" : sensornode.getAttribute("type"),
                        "port" : sensornode.getAttribute("port"),
                        "name" : sensornode.getAttribute("name"),
                    };

                    if (sensornode.getAttribute("subtype")) {
                        sensor.subType = sensornode.getAttribute("subtype");
                    }

                    sensor.state = null;
                    sensor.callsInTimeSlot = 0;
                    sensor.lastTimeIncrease = 0;

                    infos.quickPiSensors.push(sensor);
                }

                this.resetDisplay();
            }
        }
    }



    // Reset the context's display
    context.resetDisplay = function () {
        // Do something here
        //$('#grid').html('Display for the library goes here.');

        // Ask the parent to update sizes
        //context.blocklyHelper.updateSize();
        //context.updateScale();

        if (!context.display || !this.raphaelFactory)
            return;

        var piUi = getQuickPiOption('disableConnection') ? '' : strings.messages.connectionHTML;

        var hasIntroControls = $('#taskIntro').find('#introControls').length;
        if (!hasIntroControls) {
            $('#taskIntro').append(`<div id="introControls"></div>`);
        }
        if (introControls === null) {
            introControls = piUi + $('#introControls').html();
        }
        $('#introControls').html(introControls)
        $('#taskIntro').addClass('piui');

        $('#grid').html(`
            <div id="virtualSensors" style="height: 90%; width: 90%; padding: 5px;">
            </div>
             `
        );

        this.raphaelFactory.destroyAll();
        paper = this.raphaelFactory.create(
            "paperMain",
            "virtualSensors",
            $('#virtualSensors').width(),
            $('#virtualSensors').height()
        );

        if (infos.quickPiSensors == "default")
        {
            infos.quickPiSensors = [];
            addDefaultBoardSensors();
        }

        if (context.timeLineCurrent)
        {
            context.timeLineCurrent.remove();
            context.timeLineCurrent = null;
        }

        if (context.timeLineCircle)
        {
            context.timeLineCircle.remove();
            context.timeLineCircle = null;
        }

        if (context.timeLineTriangle) {
            context.timeLineTriangle.remove();
            context.timeLineTriangle = null;
        }

        if (context.autoGrading) {
            var numSensors = infos.quickPiSensors.length;
            var sensorSize = Math.min(paper.height / numSensors * 0.80, paper.width / 10);

            context.sensorSize = sensorSize * .90;

            context.timelineStartx = context.sensorSize * 3;

            var maxTime = context.maxTime;
            if (maxTime == 0)
                maxTime = 1000;

            if (!context.loopsForever)
                maxTime = Math.floor(maxTime * 1.05);

            context.pixelsPerTime = (paper.width - context.timelineStartx - 30) / maxTime;

            for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
                var sensor = infos.quickPiSensors[iSensor];

                sensor.drawInfo = {
                    x: 0,
                    y: 10 + (sensorSize * iSensor),
                    width: sensorSize * .90,
                    height: sensorSize * .90
                }

                drawSensor(sensor);
                sensor.timelinelastxlabel = 0;

                if (context.gradingStatesBySensor.hasOwnProperty(sensor.name)) {
                    var states = context.gradingStatesBySensor[sensor.name];
                    var startTime = 0;
                    var lastState = null;
                    sensor.lastAnalogState = null;

                    for (var iState = 0; iState < states.length; iState++) {
                        var state = states[iState];

                        drawSensorTimeLineState(sensor, lastState, startTime, state.time, "expected", true);

                        startTime = state.time;
                        lastState = state.state;
                    }

                    drawSensorTimeLineState(sensor, lastState, state.time, context.maxTime, "expected", true);
                    
                    if (!context.loopsForever)
                        drawSensorTimeLineState(sensor, lastState, startTime, maxTime, "finnish", false);

                    sensor.lastAnalogState = null;
                }
            }

            context.timeLineY = 10 + (sensorSize * (iSensor + 1));
            drawTimeLine();

            for (var iState = 0; iState < context.timeLineStates.length; iState++) {
                var timelinestate = context.timeLineStates[iState];

                drawSensorTimeLineState(timelinestate.sensor,
                    timelinestate.state,
                    timelinestate.startTime,
                    timelinestate.endTime,
                    timelinestate.type,
                    true);
            }
        } else {

            var nSensors = infos.quickPiSensors.length;

            infos.quickPiSensors.forEach(function (sensor) {
                var cellsAmount = findSensorDefinition(sensor).cellsAmount;
                if (cellsAmount) {
                    nSensors += cellsAmount(paper) - 1;
                }
            });

            if (infos.customSensors) {
                nSensors++;
            }

            if (nSensors < 4)
                nSensors = 4;

            var geometry = squareSize(paper.width, paper.height, nSensors);

            context.sensorSize = geometry.size * .10;

            var iSensor = 0;

            for (var col = 0; col < geometry.cols; col++) {
                var y = geometry.size * col;

                var line = paper.path(["M", 0,
                    y,
                    "L", paper.width,
                    y]);

                line.attr({
                    "stroke-width": 1,
                    "stroke": "lightgrey",
                    "stroke-linecapstring": "round"
                });

                for (var row = 0; row < geometry.rows; row++) {
                    var x = paper.width / geometry.rows * row;
                    var y1 = y + geometry.size / 4;
                    var y2 = y + geometry.size * 3 / 4;

                    line = paper.path(["M", x,
                        y1,
                        "L", x,
                        y2]);

                    line.attr({
                        "stroke-width": 1,
                        "stroke": "lightgrey",
                        "stroke-linecapstring": "round"
                    });

                    if (iSensor == infos.quickPiSensors.length && infos.customSensors) {
                        drawCustomSensorAdder(x, y, geometry.size);
                    } else if (infos.quickPiSensors[iSensor]) {
                        var sensor = infos.quickPiSensors[iSensor];


                        var cellsAmount = findSensorDefinition(sensor).cellsAmount;
                        if (cellsAmount) {
                            row += cellsAmount(paper) - 1;

                            sensor.drawInfo = {
                                x: x,
                                y: y,
                                width: geometry.size * cellsAmount(paper),
                                height: geometry.size
                            }
                        } else {
                            sensor.drawInfo = {
                                x: x,
                                y: y,
                                width: geometry.size,
                                height: geometry.size
                            }
                        }

                        drawSensor(sensor);
                    }
                    iSensor++;
                }
            }
        }

        context.blocklyHelper.updateSize();

        context.inUSBConnection = false;
        context.inBTConnection = false;
        context.releasing = false;
        context.offLineMode = true;

        showasReleased();

        if (context.quickPiConnection.isConnecting()) {
            showasConnecting();
        }

        if (context.quickPiConnection.isConnected()) {
            showasConnected();

            context.offLineMode = false;
        }

        $('#piconnect').click(function () {

            window.displayHelper.showPopupDialog(strings.messages.connectionDialogHTML);

            if (context.offLineMode) {
                $('#pirelease').attr('disabled', true);
            }
            else {
                $('#pirelease').attr('disabled', false);
            }

            $('#piconnectok').attr('disabled', true);

            $('#piconnectionlabel').hide();

            if (context.quickPiConnection.isConnected()) {
                if (getSessionStorage('connectionMethod') == "USB") {
                    $('#piconwifi').removeClass('active');
                    $('#piconusb').addClass('active');
                    $('#pischoolcon').hide();
                    $('#piaddress').val("192.168.233.1");

                    $('#piconnectok').attr('disabled', true);
                    $('#piconnectionlabel').show();
                    $('#piconnectionlabel').text(strings.messages.canConnectoToUSB)

                    context.inUSBConnection = true;
                    context.inBTConnection = false;
                } else if (getSessionStorage('connectionMethod') == "BT") {
                    $('#piconwifi').removeClass('active');
                    $('#piconbt').addClass('active');
                    $('#pischoolcon').hide();

                    $('#piaddress').val("192.168.233.2");

                    $('#piconnectok').attr('disabled', true);
                    $('#piconnectionlabel').show();
                    $('#piconnectionlabel').text(strings.messages.canConnectoToBT)

                    context.inUSBConnection = false;
                    context.inBTConnection = true;
                }
            } else {
                setSessionStorage('connectionMethod', "WIFI");
            }

            $('#piaddress').on('input', function (e) {

                if (context.offLineMode)
                {
                    var content = $('#piaddress').val();

                    if (content)
                        $('#piconnectok').attr('disabled', false);
                    else
                        $('#piconnectok').attr('disabled', true);
                }
            });

            if (infos.runningOnQuickPi)
            {
                $('#piconnectionmainui').hide();
                $('#piaddress').val(window.location.hostname);
                $('#piaddress').trigger("input");
            }

            if (getSessionStorage('pilist')) {
                populatePiList(JSON.parse(getSessionStorage('pilist')));
            }

            if (getSessionStorage('raspberryPiIpAddress')) {
                $('#piaddress').val(getSessionStorage('raspberryPiIpAddress'));
                $('#piaddress').trigger("input");
            }

            if (getSessionStorage('schoolkey')) {
                $('#schoolkey').val(getSessionStorage('schoolkey'));
                $('#pigetlist').attr("disabled", false);
            }

            $('#piconnectok').click(function () {
                context.inUSBConnection = false;
                context.inBTConnection = false;

                $('#popupMessage').hide();
                window.displayHelper.popupMessageShown = false;

                if ($('#piusetunnel').is(":checked")) {

                    var piname = $("#pilist option:selected").text().split("-")[0].trim();

                    var url = "ws://api.quick-pi.org/client/" +
                        $('#schoolkey').val()  + "-" +
                        piname +
                        "/api/v1/commands";

                    setSessionStorage('quickPiUrl', url);
                    context.quickPiConnection.connect(url);

                } else {
                    var ipaddress = $('#piaddress').val();
                    setSessionStorage('raspberryPiIpAddress', ipaddress);

                    showasConnecting();
                    var url = "ws://" + ipaddress + ":5000/api/v1/commands";
                    setSessionStorage('quickPiUrl', url);

                    context.quickPiConnection.connect(url);
                }
            });

            $('#pirelease').click(function () {
                context.inUSBConnection = false;
                context.inBTConnection = false;

                $('#popupMessage').hide();
                window.displayHelper.popupMessageShown = false;

                // IF connected release lock
                context.releasing = true;
                context.quickPiConnection.releaseLock();
            });

            $('#picancel').click(function () {
                context.inUSBConnection = false;
                context.inBTConnection = false;

                $('#popupMessage').hide();
                window.displayHelper.popupMessageShown = false;
            });

            $('#schoolkey').on('input', function (e) {
                var schoolkey = $('#schoolkey').val();
                setSessionStorage('schoolkey', schoolkey);

                if (schoolkey)
                    $('#pigetlist').attr("disabled", false);
                else
                    $('#pigetlist').attr("disabled", true);
            });


            $('#pigetlist').click(function () {
                var schoolkey = $('#schoolkey').val();

                fetch('http://www.france-ioi.org/QuickPi/list.php?school=' + schoolkey)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (jsonlist) {
                        populatePiList(jsonlist);
                    });
            });

            // Select device connexion methods
            $('#piconsel .btn').click(function () {
                if (!context.quickPiConnection.isConnected()) {
                    if (!$(this).hasClass('active')) {
                        $('#piconsel .btn').removeClass('active');
                        $(this).addClass('active');
                    }
                }
            });

            $('#piconwifi').click(function () {
                if (!context.quickPiConnection.isConnected()) {
                    setSessionStorage('connectionMethod', "WIFI");
                    $(this).addClass('active');
                    $('#pischoolcon').show("slow");
                    $('#piconnectionlabel').hide();
                }

                context.inUSBConnection = false;
                context.inBTConnection = false;

            });

            $('#piconusb').click(function () {
                if (!context.quickPiConnection.isConnected()) {
                    setSessionStorage('connectionMethod', "USB");
                    $('#piconnectok').attr('disabled', true);
                    $('#piconnectionlabel').show();
                    $('#piconnectionlabel').html(strings.messages.cantConnectoToUSB)

                    $(this).addClass('active');
                    $('#pischoolcon').hide("slow");
                    $('#piaddress').val("192.168.233.1");

                    context.inUSBConnection = true;
                    context.inBTConnection = false;

                    function updateUSBAvailability(available) {

                        if  (context.inUSBConnection && context.offLineMode) {
                            if (available) {
                                $('#piconnectok').attr('disabled', false);

                                $('#piconnectionlabel').text(strings.messages.canConnectoToUSB)
                            } else {
                                $('#piconnectok').attr('disabled', true);

                                $('#piconnectionlabel').html(strings.messages.cantConnectoToUSB)
                            }

                            context.quickPiConnection.isAvailable("192.168.233.1", updateUSBAvailability);
                        }
                    }

                    updateUSBAvailability(false);


                }
            });

            $('#piconbt').click(function () {
                $('#piconnectionlabel').show();
                if (!context.quickPiConnection.isConnected()) {
                    setSessionStorage('connectionMethod', "BT");
                    $('#piconnectok').attr('disabled', true);
                    $('#piconnectionlabel').show();
                    $('#piconnectionlabel').html(strings.messages.cantConnectoToBT)

                    $(this).addClass('active');
                    $('#pischoolcon').hide("slow");

                    $('#piaddress').val("192.168.233.2");

                    context.inUSBConnection = false;
                    context.inBTConnection = true;

                    function updateBTAvailability(available) {

                        if  (context.inUSBConnection && context.offLineMode) {
                            if (available) {
                                $('#piconnectok').attr('disabled', false);

                                $('#piconnectionlabel').text(strings.messages.canConnectoToBT)
                            } else {
                                $('#piconnectok').attr('disabled', true);

                                $('#piconnectionlabel').html(strings.messages.cantConnectoToBT)
                            }

                            context.quickPiConnection.isAvailable("192.168.233.2", updateUSBAvailability);
                        }
                    }

                    updateBTAvailability(false);
                }
            });

            function populatePiList(jsonlist) {
                setSessionStorage('pilist', JSON.stringify(jsonlist));

                var select = document.getElementById("pilist");
                var first = true;

                $('#pilist').empty();
                $('#piusetunnel').attr('disabled', true);

                for (var i = 0; i < jsonlist.length; i++) {
                    var pi = jsonlist[i];

                    var el = document.createElement("option");

                    var minutes = Math.round(jsonlist[i].seconds_since_ping / 60);
                    var timeago = "";

                    if (minutes < 60)
                        timeago = strings.messages.minutesago.format(minutes);
                    else
                        timeago = strings.messages.hoursago;


                    el.textContent = jsonlist[i].name + " - " + timeago;
                    el.value = jsonlist[i].ip;

                    select.appendChild(el);

                    if (first) {
                        $('#piaddress').val(jsonlist[i].ip);
                        $('#piaddress').trigger("input");
                        first = false;
                        $('#pilist').prop('disabled', false);

                        $('#piusetunnel').attr('disabled', false);
                    }
                }
            }

            $('#pilist').on('change', function () {
                $("#piaddress").val(this.value);
            });
        });



        $('#pichangehat').click(function () {
            window.displayHelper.showPopupDialog(`
            <div class="content connectPi qpi">
            <div class="panel-heading">
                <h2 class="sectionTitle">
                    <span class="iconTag"><i class="icon fas fa-list-ul"></i></span>
                    Choisissez votre carte
                </h2>
                <div class="exit" id="picancel"><i class="icon fas fa-times"></i></div>
            </div>
            <div class="panel-body">

                <div id=boardlist>
                </div>

                <div panel-body-usbbt>
                    <label id="piconnectionlabel"></label>
                </div>
            </div>
        </div>`);

            $('#picancel').click(function () {
                $('#popupMessage').hide();
                window.displayHelper.popupMessageShown = false;
            });


            for (var i = 0; i < boardDefinitions.length; i++) {
                var board = boardDefinitions[i];
                var image = document.createElement('img');
                image.src = getImg(board.image);

                $('#boardlist').append(image).append("&nbsp;&nbsp;");

                image.onclick = function () {
                    $('#popupMessage').hide();
                    window.displayHelper.popupMessageShown = false;

                    context.changeBoard(board.name);
                }
            }
        });


        $('#pihatsetup').click(function () {

            var command = "getBuzzerAudioOutput()";
            context.quickPiConnection.sendCommand(command, function(val) {
                var buzzerstate = parseInt(val);

                window.displayHelper.showPopupDialog(`
                <div class="content connectPi qpi">
                <div class="panel-heading">
                    <h2 class="sectionTitle">
                        <span class="iconTag"><i class="icon fas fa-list-ul"></i></span>
                        QuickPi Hat Settings
                    </h2>
                    <div class="exit" id="picancel"><i class="icon fas fa-times"></i></div>
                </div>
                <div class="panel-body">
                    <div>
                        <input type="checkbox" id="buzzeraudio" value="buzzeron"> Output audio trought audio buzzer<br>
                    </div>

                    <div class="inlineButtons">
                        <button id="pisetupok" class="btn"><i class="fas fa-cog icon"></i>Set</button>
                </div>
                </div>
            </div>`);

                $('#buzzeraudio').prop('checked', buzzerstate ? true : false);


                $('#picancel').click(function () {
                    $('#popupMessage').hide();
                    window.displayHelper.popupMessageShown = false;
                });

                $('#pisetupok').click(function () {
                    $('#popupMessage').hide();
                    window.displayHelper.popupMessageShown = false;

                    var radioValue = $('#buzzeraudio').is(":checked");

                    var command = "setBuzzerAudioOutput(" + (radioValue ? "True" : "False") + ")";
                    context.quickPiConnection.sendCommand(command, function(x) {});
                });
            });
        });

        $('#piinstall').click(function () {
            context.blocklyHelper.reportValues = false;

            python_code = context.generatePythonSensorTable();
            python_code += "\n\n";
            python_code += window.task.displayedSubTask.blocklyHelper.getCode('python');

            python_code = python_code.replace("from quickpi import *", "");

            if (context.runner)
                context.runner.stop();

            context.installing = true;
            $('#piinstallprogresss').show();
            $('#piinstallcheck').hide();

            context.quickPiConnection.installProgram(python_code, function () {
                context.justinstalled = true;
                $('#piinstallprogresss').hide();
                $('#piinstallcheck').show();
            });
        });


        if (parseInt(getSessionStorage('autoConnect'))) {
            if (!context.quickPiConnection.isConnected() && !context.quickPiConnection.isConnecting()) {
                $('#piconnect').attr("disabled", true);
                context.quickPiConnection.connect(getSessionStorage('quickPiUrl'));
            }
        }
    };

    function addDefaultBoardSensors() {
        var board = getCurrentBoard();
        var boardDefaultSensors = board.default;

        if (!boardDefaultSensors)
            boardDefaultSensors = board.builtinSensors;

        if (boardDefaultSensors)
        {
            for (var i = 0; i < boardDefaultSensors.length; i++) {
                var sensor = boardDefaultSensors[i];

                var newSensor = {
                    "type": sensor.type,
                    "port": sensor.port,
                    "builtin": true,
                };

                if (sensor.subType) {
                    newSensor.subType = sensor.subType;
                }

                newSensor.name = getSensorSuggestedName(sensor.type, sensor.suggestedName);

                sensor.state = null;
                sensor.callsInTimeSlot = 0;
                sensor.lastTimeIncrease = 0;

                infos.quickPiSensors.push(newSensor);
            }

        }

    };

    function getNewSensorSuggestedName(name) {
        var maxvalue = 0;

        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];

            var firstdigit = sensor.name.search(/\d/);
            if (firstdigit > 0) {
                var namepart = sensor.name.substring(0, firstdigit);
                var numberpart = parseInt(sensor.name.substring(firstdigit), 10);

                if (name == namepart && numberpart > maxvalue) {
                    maxvalue = numberpart;
                }
            }
        }

        return name + (maxvalue + 1);
    }

    function drawCustomSensorAdder(x, y, size) {
        if (context.sensorAdder) {
            context.sensorAdder.remove();
        }

        var centerx = x + size / 2;
        var centery = y + size / 2;
        var fontsize = size * .70;

        context.sensorAdder = paper.text(centerx, centery, "+");

        context.sensorAdder.attr({
            "font-size": fontsize + "px",
            fill: "lightgray"
        });
        context.sensorAdder.node.style = "-moz-user-select: none; -webkit-user-select: none;";

        context.sensorAdder.click(function () {

            window.displayHelper.showPopupDialog(`
                <div class="content qpi">
                    <div class="panel-heading">
                        <h2 class="sectionTitle">
                            <span class="iconTag"><i class="icon fas fa-list-ul"></i></span>
                            Ajouter un composant
                        </h2>
                        <div class="exit" id="picancel"><i class="icon fas fa-times"></i></div>
                    </div>
                    <div id="sensorPicker" class="panel-body">
                        <label>Sélectionnez un composant à ajouter à votre Raspberry Pi et attachez-le à un port.</label>
                        <div class="flex-container">
                            <div id="selector-image-container" class="flex-col half">
                                <img id="selector-sensor-image">
                            </div>
                            <div class="flex-col half">
                                <div class="form-group">
                                    <div class="input-group">
                                        <select id="selector-sensor-list" class="custom-select"></select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group">
                                        <select id="selector-sensor-port" class="custom-select"></select>
                                    </div>
                                    <label id="selector-label"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="singleButton">
                        <button id="selector-add-button" class="btn btn-centered"><i class="icon fa fa-check"></i>Ajouter</button>
                    </div>
                </div>
            `);

            var select = document.getElementById("selector-sensor-list");
            for (var iSensorDef = 0; iSensorDef < sensorDefinitions.length; iSensorDef++) {
                var sensorDefinition = sensorDefinitions[iSensorDef];

                if (sensorDefinition.subTypes) {
                    for (var iSubType = 0; iSubType < sensorDefinition.subTypes.length; iSubType++) {

                        if (!sensorDefinition.pluggable && !sensorDefinition.subTypes[iSubType].pluggable)
                            continue;


                        var el = document.createElement("option");
                        el.textContent = sensorDefinition.description;

                        if (sensorDefinition.subTypes[iSubType].description)
                            el.textContent = sensorDefinition.subTypes[iSubType].description;

                        el.value = sensorDefinition.name;
                        el.value += "-" + sensorDefinition.subTypes[iSubType].subType;
                        select.appendChild(el);
                    }
                } else {
                    if (!sensorDefinition.pluggable)
                        continue;

                    var el = document.createElement("option");
                    el.textContent = sensorDefinition.description;
                    el.value = sensorDefinition.name;

                    select.appendChild(el);
                }
            }

            var board = getCurrentBoard();
            if (board.builtinSensors) {
                for (var i = 0; i < board.builtinSensors.length; i++) {
                    var sensor = board.builtinSensors[i];
                    var sensorDefinition = findSensorDefinition(sensor);

                    if (context.findSensor(sensor.type, sensor.port, false))
                        continue;

                    var el = document.createElement("option");

                    el.textContent = sensorDefinition.description + "(builtin)";
                    el.value = sensorDefinition.name + "-";

                    if (sensor.subType)
                        el.value += sensor.subType;

                    el.value += "-" + sensor.port;

                    select.appendChild(el);
                }
            }

            $('#selector-sensor-list').on('change', function () {
                var values = this.value.split("-");
                var builtinport = false;

                var dummysensor = { type: values[0] };

                if (values.length >= 2)
                    if (values[1])
                        dummysensor.subType = values[1];

                if (values.length >= 3)
                    builtinport = values[2];

                var sensorDefinition = findSensorDefinition(dummysensor);

                var imageContainer = document.getElementById("selector-image-container");
                while (imageContainer.firstChild) {
                    imageContainer.removeChild(imageContainer.firstChild);
                }
                for (var i = 0; i < sensorDefinition.selectorImages.length; i++) {
                    var image = document.createElement('img');

                    image.src = getImg(sensorDefinition.selectorImages[i]);

                    imageContainer.appendChild(image);

                    //$('#selector-sensor-image').attr("src", getImg(sensorDefinition.selectorImages[0]));
                }


                var portSelect = document.getElementById("selector-sensor-port");
                $('#selector-sensor-port').empty();
                var hasPorts = false;
                if (builtinport) {
                    var option = document.createElement('option');
                    option.innerText = builtinport;
                    option.value = builtinport;
                    portSelect.appendChild(option);
                    hasPorts = true;
                } else {
                    var ports = getCurrentBoard().portTypes[sensorDefinition.portType];
                    if (sensorDefinition.portType == "i2c")
                    {
                        ports = ["i2c"];
                    }

                    for (var iPort = 0; iPort < ports.length; iPort++) {
                        var port = sensorDefinition.portType + ports[iPort];
                        if (sensorDefinition.portType == "i2c")
                            port = "i2c";

                        if (!isPortUsed(sensorDefinition.name, port)) {
                            var option = document.createElement('option');
                            option.innerText = port;
                            option.value = port;
                            portSelect.appendChild(option);
                            hasPorts = true;
                        }
                    }
                }



                if (!hasPorts) {
                    $('#selector-add-button').attr("disabled", true);

                    var object_function = strings.messages.actuator;
                    if (sensorDefinition.isSensor)
                        object_function = strings.messages.sensor;

                    $('#selector-label').text(strings.messages.noPortsAvailable.format(object_function, sensorDefinition.portType));
                    $('#selector-label').show();
                }
                else {
                    $('#selector-add-button').attr("disabled", false);
                    $('#selector-label').hide();
                }
            });

            $('#selector-add-button').click(function () {
                var sensorType = $("#selector-sensor-list option:selected").val();
                var values = sensorType.split("-");

                var dummysensor = { type: values[0] };
                if (values.length == 2)
                    dummysensor.subType = values[1];

                var sensorDefinition = findSensorDefinition(dummysensor);


                var port = $("#selector-sensor-port option:selected").text();
                var name = getNewSensorSuggestedName(sensorDefinition.name);

                if(name == 'screen1') {
                    // prepend screen because squareSize func can't handle cells wrap
                    infos.quickPiSensors.unshift({
                        type: sensorDefinition.name,
                        subType: sensorDefinition.subType,
                        port: port,
                        name: name
                    });                    

                } else {
                    infos.quickPiSensors.push({
                        type: sensorDefinition.name,
                        subType: sensorDefinition.subType,
                        port: port,
                        name: name
                    });                    
                }



                $('#popupMessage').hide();
                window.displayHelper.popupMessageShown = false;

                context.resetSensorTable();
                context.resetDisplay();
            });


            $("#selector-sensor-list").trigger("change");

            $('#picancel').click(function () {
                $('#popupMessage').hide();
                window.displayHelper.popupMessageShown = false;
            });
        });
    };

    function isPortUsed(type, port) {
        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];

            if (port == "i2c")
            {
                if (sensor.type == type)
                    return true;
            } else {
                if (sensor.port == port)
                    return true;
            }
        }

        return false;
    };

    // Straight from stack overflow :)
    function squareSize(x, y, n) {
        // Compute number of rows and columns, and cell size
        var ratio = x / y;
        var ncols_float = Math.sqrt(n * ratio);
        var nrows_float = n / ncols_float;

        // Find best option filling the whole height
        var nrows1 = Math.ceil(nrows_float);
        var ncols1 = Math.ceil(n / nrows1);
        while (nrows1 * ratio < ncols1) {
            nrows1++;
            ncols1 = Math.ceil(n / nrows1);
        }
        var cell_size1 = y / nrows1;

        // Find best option filling the whole width
        var ncols2 = Math.ceil(ncols_float);
        var nrows2 = Math.ceil(n / ncols2);
        while (ncols2 < nrows2 * ratio) {
            ncols2++;
            nrows2 = Math.ceil(n / ncols2);
        }
        var cell_size2 = x / ncols2;

        // Find the best values
        var nrows, ncols, cell_size;
        if (cell_size1 < cell_size2) {
            nrows = nrows2;
            ncols = ncols2;
            cell_size = cell_size2;
        } else {
            nrows = nrows1;
            ncols = ncols1;
            cell_size = cell_size1;
        }

        return {
            rows: ncols,
            cols: nrows,
            size: cell_size
        };
    }

    function showasConnected() {
        $('#piconnectprogress').hide();
        $('#piinstallcheck').hide();
        $('#piinstallprogresss').hide();
        $('#piinstallui').show();

        if (context.board == "quickpi")
            $('#pihatsetup').show();
        else
            $('#pihatsetup').hide();

        $('#piconnect').css('background-color', '#F9A423');

        $('#piinstall').css('background-color', "#488FE1");

        $('#piconnecttext').hide();
    }

    function showasConnecting() {
        $('#piconnectprogress').show();
        $('#piinstallcheck').hide();
        $('#piinstallprogresss').hide();
    }

    function showasReleased() {
        $('#piconnectprogress').hide();
        $('#piinstallcheck').hide();
        $('#piinstallprogresss').hide();
        $('#piinstallui').hide();
        $('#pihatsetup').hide();
        $('#piconnect').css('background-color', '#F9A423');
        $('#piconnecttext').show();
    }


    function showasDisconnected() {
        $('#piconnectprogress').hide();
        $('#piinstallcheck').hide();
        $('#piinstallprogresss').hide();
        $('#piinstall').css('background-color', 'gray');
        $('#piconnect').css('background-color', 'gray');
        $('#piconnecttext').hide();
    }

    function raspberryPiConnected() {
        showasConnected();

        context.resetSensorTable();

        context.quickPiConnection.startNewSession();

        context.liveUpdateCount = 0;
        context.offLineMode = false;

        setSessionStorage('autoConnect', "1");

        context.resetDisplay();

        startSensorPollInterval();
    }

    function raspberryPiDisconnected(wasConnected, wrongversion) {

        if (context.releasing || !wasConnected)
            showasReleased();
        else
            showasDisconnected();

        window.task.displayedSubTask.context.offLineMode = true;

        if (context.quickPiConnection.wasLocked()) {
            window.displayHelper.showPopupMessage(strings.messages.piPlocked, 'blanket');
        } else if (wrongversion) {
            window.displayHelper.showPopupMessage(strings.messages.wrongVersion, 'blanket');
        } else if (!context.releasing && !wasConnected) {
            window.displayHelper.showPopupMessage(strings.messages.cantConnect, 'blanket');
        }

        clearSensorPollInterval();

        if (wasConnected && !context.releasing && !context.quickPiConnection.wasLocked() && !wrongversion) {
            context.quickPiConnection.connect(getSessionStorage('quickPiUrl'));
        } else {
            // If I was never connected don't attempt to autoconnect again
            setSessionStorage('autoConnect', "0");
            window.task.displayedSubTask.context.resetDisplay();
        }

    }

    function raspberryPiChangeBoard(board) {
        window.task.displayedSubTask.context.changeBoard(board);
        window.task.displayedSubTask.context.resetSensorTable();
    }


    // Update the context's display to the new scale (after a window resize for instance)
    context.updateScale = function () {
        if (!context.display) {
            return;
        }

        var width = $('#virtualSensors').width();
        var height =  $('#virtualSensors').height();

        if (!context.oldwidth ||
            !context.oldheight ||
            context.oldwidth != width ||
            context.oldheight != height) {

            context.oldwidth = width;
            context.oldheight =  height;

            context.resetDisplay();
        }
    };

    // When the context is unloaded, this function is called to clean up
    // anything the context may have created
    context.unload = function () {
        // Do something here
        clearSensorPollInterval();
        if (context.display) {
            // Do something here
        }

        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];

            sensor.removed = true;
        }

    };

    function drawTimeLine() {
        if (paper == undefined || !context.display)
            return;

        if (context.timelineText)
            for (var i = 0; i < context.timelineText.length; i++) {
                context.timelineText[i].remove();
            }

        context.timelineText = [];

        var step = 1000;
        if (context.maxTime <= 1000)
            step = 100;
        else if (context.maxTime <= 3000)
            step = 500;
        else
            step = 1000;


        var i = 0;
        for (; i <= context.maxTime; i += step) {
            var x = context.timelineStartx + (i * context.pixelsPerTime);

            var timelabel = paper.text(x, context.timeLineY, (i / 1000).toString() + "s");

            var fontsize = context.pixelsPerTime * step * 0.4;
            if (fontsize > 15)
                fontsize = 15;

            timelabel.attr({ "font-size": fontsize.toString() + "px", 'text-anchor': 'center', 'font-weight': 'bold', fill: "gray" });

            context.timelineText.push(timelabel);
        }

        context.timeLineHoverPath = paper.path(["M", context.timelineStartx,
                    context.timeLineY,
                    "L", context.timelineStartx + (context.maxTime * context.pixelsPerTime),
                    (context.timeLineY)]);

        context.timeLineHoverPath.attr({
            "stroke-width": 40,
             "opacity": 0,
             "stroke-linecap": "square",
             "stroke-linejoin": "round",
        });

        context.timeLineHoverPath.mousemove(function(event){

            $('#screentooltip').remove();

            var ms = (event.clientX - context.timelineStartx) / context.pixelsPerTime;
            ms = Math.round(ms);

            if (ms < -4)
                return;
            if (ms < 0)
                ms = 0;

            $( "body" ).append('<div id="screentooltip"></div>');
            $('#screentooltip').css("position", "absolute");
            $('#screentooltip').css("border", "1px solid gray");
            $('#screentooltip').css("background-color", "#efefef");
            $('#screentooltip').css("padding", "3px");
            $('#screentooltip').css("z-index", "1000");

            $('#screentooltip').css("left", event.clientX + 2).css("top", event.clientY + 2);

            $('#screentooltip').text(ms.toString() + "ms");

            if (context.timeLineHoverLine)
                context.timeLineHoverLine.remove();
            context.timeLineHoverLine = paper.path(["M", event.clientX,
                                        0,
                                        "L", event.clientX,
                                        context.timeLineY]);
            context.timeLineHoverLine.attr({
                                           "stroke-width": 4,
                                            "stroke": "blue",
                                             "opacity": 0.2,
                                             "stroke-linecap": "square",
                                             "stroke-linejoin": "round",
            });
        });

        context.timeLineHoverPath.mouseout(function() {
            if (context.timeLineHoverLine)
                context.timeLineHoverLine.remove();
            $('#screentooltip').remove();
        });



        if (!context.loopsForever) {
            var endx = context.timelineStartx + (context.maxTime * context.pixelsPerTime);
            var x = context.timelineStartx + (i * context.pixelsPerTime);
            var timelabel = paper.text(x, context.timeLineY, '\uf11e');      
            timelabel.node.style.fontFamily = '"Font Awesome 5 Free"';
            timelabel.node.style.fontWeight = "bold";

            timelabel.attr({ "font-size": "20" + "px", 'text-anchor': 'middle', 'font-weight': 'bold', fill: "gray" });
            context.timelineText.push(timelabel);

			if (context.timeLineEndLine)
				context.timeLineEndLine.remove();

            context.timeLineEndLine = paper.path(["M", endx,
                                                0,
                                                "L", endx,
                                                context.timeLineY]);


            if (context.endFlagEnd)
                context.endFlagEnd.remove();
            context.endFlagEnd = paper.rect(endx, 0, x, context.timeLineY + 10);
            context.endFlagEnd.attr({
                "fill": "lightgray",
                "stroke": "none",
                "opacity": 0.2,
            });
        }


        /*
                paper.path(["M", context.timelineStartx,
                    paper.height - context.sensorSize * 3 / 4,
                    "L", paper.width,
                    paper.height - context.sensorSize * 3 / 4]);
        */
    }

    function drawCurrentTime() {
        if (!paper || !context.display || isNaN(context.currentTime))
            return;
/*
        if (context.currentTimeText)
            context.currentTimeText.remove();

        context.currentTimeText = paper.text(0, paper.height - 40, context.currentTime.toString() + "ms");
        context.currentTimeText.attr({
            "font-size": "10px",
            'text-anchor': 'start'
        });            */

        if (!context.autoGrading)
            return;

        var animationSpeed = 200; // ms
        var startx = context.timelineStartx + (context.currentTime * context.pixelsPerTime);

        var targetpath = ["M", startx, 0, "L", startx, context.timeLineY];

        if (context.timeLineCurrent)
        {
            context.timeLineCurrent.animate({path: targetpath}, animationSpeed);
        }
        else
        {
            context.timeLineCurrent = paper.path(targetpath);

            context.timeLineCurrent.attr({
                    "stroke-width": 5,
                    "stroke": "#678AB4",
                    "stroke-linecap": "round"
            });
        }


        if (context.timeLineCircle)
        {
            context.timeLineCircle.animate({cx: startx}, animationSpeed);
        }
        else
        {
            var circleradius = 10;
            context.timeLineCircle = paper.circle(startx, context.timeLineY, 10);

            context.timeLineCircle.attr({
                "fill": "white",
                "stroke": "#678AB4"
            });
        }

        var trianglew = 10;
        var targetpath = ["M", startx, 0,
                "L", startx + trianglew, 0,
                "L", startx, trianglew,
                "L", startx - trianglew, 0,
                "L", startx, 0
            ];

        if (context.timeLineTriangle)
        {
            context.timeLineTriangle.animate({path: targetpath}, animationSpeed);
        }
        else
        {
            context.timeLineTriangle = paper.path(targetpath);

            context.timeLineTriangle.attr({
                "fill": "#678AB4",
                "stroke": "#678AB4"
            });
        }

    }

    function storeTimeLineState(sensor, state, startTime, endTime, type) {
        var found = false;
        var timelinestate = {
            sensor: sensor,
            state: state,
            startTime: startTime,
            endTime: endTime,
            type: type
        };

        for (var i = 0; i < context.timeLineStates.length; i++) {
            var currenttlstate = context.timeLineStates[i];

            if (currenttlstate.sensor == sensor &&
                currenttlstate.startTime == startTime &&
                currenttlstate.endTime == endTime &&
                currenttlstate.type == type) {
                context.timeLineStates[i] = timelinestate;
                found = true;
                break;
            }
        }

        if (!found) {
            context.timeLineStates.push(timelinestate);
        }
    }


    function drawSensorTimeLineState(sensor, state, startTime, endTime, type, skipsave = false, expectedState = null) {
        if (paper == undefined ||
            !context.display ||
            !context.autoGrading)
            return;

        if (!skipsave) {
            storeTimeLineState(sensor, state, startTime, endTime, type);
        }

        var startx = context.timelineStartx + (startTime * context.pixelsPerTime);
        var stateLenght = (endTime - startTime) * context.pixelsPerTime;

        var ypositionmiddle = ((sensor.drawInfo.y + (sensor.drawInfo.height * .5)) + (sensor.drawInfo.height * .20));

        var ypositiontop = sensor.drawInfo.y
        var ypositionbottom = sensor.drawInfo.y + sensor.drawInfo.height;

        var color = "green";
        var strokewidth = 4;
        if (type == "expected" || type == "finnish") {
            color = "lightgrey";
            strokewidth = 8;
        } else if (type == "wrong") {
            color = "red";
            strokewidth = 4;
        }
        else if (type == "actual") {
            color = "yellow";
            strokewidth = 4;
        }

        var isAnalog = findSensorDefinition(sensor).isAnalog;
        var percentage = + state;

        var drawnElements = [];
        var deleteLastDrawnElements = true;

        if (sensor.type == "accelerometer" ||
            sensor.type == "gyroscope" ||
            sensor.type == "magnetometer") {

            if (state != null) {
            for (var i = 0; i < 3; i++) {
                var startx = context.timelineStartx + (startTime * context.pixelsPerTime);
                var stateLenght = (endTime - startTime) * context.pixelsPerTime;
        
                var yspace = sensor.drawInfo.height / 3;
                var ypositiontop = sensor.drawInfo.y + (yspace * i)
                var ypositionbottom = ypositiontop + yspace;
        
                var offset = (ypositionbottom - ypositiontop) * findSensorDefinition(sensor).getPercentageFromState(state[i], sensor);
                
                if (type == "expected" || type == "finnish") {
                    color = "lightgrey";
                    strokewidth = 4;
                } else  if (type == "wrong") {
                    color = "red";
                    strokewidth = 2;
                }
                else if (type == "actual") {
                    color = "yellow";
                    strokewidth = 2;
                }

                if (sensor.lastAnalogState != null &&
                    sensor.lastAnalogState[i] != state[i]) {

                    var oldStatePercentage = findSensorDefinition(sensor).getPercentageFromState(sensor.lastAnalogState[i], sensor);

                    var previousOffset = (ypositionbottom - ypositiontop) * oldStatePercentage;

                    var joinline = paper.path(["M", startx,
                        ypositiontop + offset,
                        "L", startx,
                        ypositiontop + previousOffset]);

                    joinline.attr({
                        "stroke-width": strokewidth,
                        "stroke": color,
                        "stroke-linejoin": "round",
                        "stroke-linecap": "round"
                    });

                    if (sensor.timelinelastxlabel == null)
                        sensor.timelinelastxlabel = [0, 0, 0];
                
                    if ((startx) - sensor.timelinelastxlabel[i] > 40)
                    {
                        var sensorDef = findSensorDefinition(sensor);
                        var stateText = state.toString();
                        if(sensorDef && sensorDef.getStateString) {
                            stateText = sensorDef.getStateString(state[i]);
                        }

                        var paperText = paper.text(startx, ypositiontop + offset - 10, stateText);
                        drawnElements.push(paperText);

                        sensor.timelinelastxlabel[i] = startx;
                    }
                }

                var stateline = paper.path(["M", startx,
                    ypositiontop + offset,
                    "L", startx + stateLenght,
                    ypositiontop + offset]);

                stateline.attr({
                    "stroke-width": strokewidth,
                    "stroke": color,
                    "stroke-linejoin": "round",
                    "stroke-linecap": "round"
                });

                drawnElements.push(stateline);
            }
                sensor.lastAnalogState = state == null ? [0, 0, 0] : state;
            }
            

        } else
        if (isAnalog || sensor.showAsAnalog) {
            var offset = (ypositionbottom - ypositiontop) * findSensorDefinition(sensor).getPercentageFromState(state, sensor);

            if (type == "wrong") {
                color = "red";
                ypositionmiddle += 4;
            }
            else if (type == "actual") {
                color = "yellow";
                ypositionmiddle += 4;
            }

            if (sensor.lastAnalogState != null
                && sensor.lastAnalogState != state) {
                var oldStatePercentage = findSensorDefinition(sensor).getPercentageFromState(sensor.lastAnalogState, sensor);

                var previousOffset = (ypositionbottom - ypositiontop) * oldStatePercentage;

                var joinline = paper.path(["M", startx,
                    ypositiontop + offset,
                    "L", startx,
                    ypositiontop + previousOffset]);

                joinline.attr({
                    "stroke-width": strokewidth,
                    "stroke": color,
                    "stroke-linejoin": "round",
                    "stroke-linecap": "round"
                });

                if (!sensor.timelinelastxlabel)
                    sensor.timelinelastxlabel = 0;
                
                if (!sensor.timelinelastxlabel)
                    sensor.timelinelastxlabel = 0;

                if ((startx) - sensor.timelinelastxlabel > 5)
                {
                    var sensorDef = findSensorDefinition(sensor);
                    var stateText = state.toString();
                    if(sensorDef && sensorDef.getStateString) {
                        stateText = sensorDef.getStateString(state);
                    }

                    if (sensor.timelinestateup) {
                        var paperText = paper.text(startx, ypositiontop + offset - 10, stateText);
                        sensor.timelinestateup = false;
                    }
                    else {
                        var paperText = paper.text(startx, ypositiontop + offset + 20, stateText);
                        sensor.timelinestateup = true;
                    }
                    drawnElements.push(paperText);

                    sensor.timelinelastxlabel = startx;
                }
            }

            sensor.lastAnalogState = state == null ? 0 : state;

            var stateline = paper.path(["M", startx,
                ypositiontop + offset,
                "L", startx + stateLenght,
                ypositiontop + offset]);

            stateline.attr({
                "stroke-width": strokewidth,
                "stroke": color,
                "stroke-linejoin": "round",
                "stroke-linecap": "round"
            });

            drawnElements.push(stateline);
        } else if (sensor.type == "stick") {
            var stateToFA = [
                "\uf062",
                "\uf063",
                "\uf060",
                "\uf061",
                "\uf111",
            ]
            

            var spacing = sensor.drawInfo.height / 5;
            for (var i = 0; i < 5; i++)
            {
                if (state && state[i])
                {
                    var ypos = sensor.drawInfo.y + (i * spacing);
                    var startingpath = ["M", startx,
                            ypos,
                            "L", startx,
                            ypos];

                    var targetpath = ["M", startx,
                            ypos,
                            "L", startx + stateLenght,
                            ypos];

                    if (type == "expected")
                    {
                        var stateline = paper.path(targetpath);
                    }
                    else
                    {
                        var stateline = paper.path(startingpath);
                        stateline.animate({path: targetpath}, 200);
                    }

                    stateline.attr({
                        "stroke-width": 2,
                        "stroke": color,
                        "stroke-linejoin": "round",
                        "stroke-linecap": "round"
                    });

                    drawnElements.push(stateline);

                    if (type == "expected") {
                        sensor.stateArrow = paper.text(startx, ypos, stateToFA[i]);

                        sensor.stateArrow.attr({
                            "font": "Font Awesome 5 Free",
                            "stroke": color,
                            "fill": color,
                            "font-size": (strokewidth * 2) + "px"
                        });
        
                        sensor.stateArrow.node.style.fontFamily = '"Font Awesome 5 Free"';
                        sensor.stateArrow.node.style.fontWeight = "bold";
                    }
                }
            }

        } else if (sensor.type == "screen" && state) {
            var sensorDef = findSensorDefinition(sensor);
            if (type != "actual" || !sensor.lastScreenState || !sensorDef.compareState(sensor.lastScreenState, state)) 
            {
                sensor.lastScreenState = state;
                if (state.isDrawingData) {
                    var stateBubble = paper.text(startx, ypositionmiddle + 10, '\uf303');

                    stateBubble.attr({
                        "font": "Font Awesome 5 Free",
                        "stroke": color,
                        "fill": color,
                        "font-size": (4 * 2) + "px"
                    });

                    stateBubble.node.style.fontFamily = '"Font Awesome 5 Free"';
                    stateBubble.node.style.fontWeight = "bold";

                    function showPopup(event) {

                        if (!sensor.showingTooltip)
                        {
                            $( "body" ).append('<div id="screentooltip"></div>');

                            $('#screentooltip').css("position", "absolute");
                            $('#screentooltip').css("border", "1px solid gray");
                            $('#screentooltip').css("background-color", "#efefef");
                            $('#screentooltip').css("padding", "3px");
                            $('#screentooltip').css("z-index", "1000");
                            $('#screentooltip').css("width", "262px");
                            $('#screentooltip').css("height", "70px");

                            $('#screentooltip').css("left", event.clientX+2).css("top", event.clientY+2);

                            var canvas = document.createElement("canvas");
                            canvas.id = "tooltipcanvas";
                            canvas.width = 128 * 2;
                            canvas.height = 32 * 2;
                            $('#screentooltip').append(canvas);

                            
                            $(canvas).css("position", "absolute");
                            $(canvas).css("z-index", "1500");
                            $(canvas).css("left", 3).css("top", 3);


                            var ctx = canvas.getContext('2d');

                            if (expectedState && type == "wrong") {
                                screenDrawing.renderDifferences(expectedState, state, canvas, 2);
                            } else {
                                screenDrawing.renderToCanvas(state, canvas, 2);
                            }
      
                            sensor.showingTooltip = true;
                        }
                    };

                    $(stateBubble.node).mouseenter(showPopup);
                    $(stateBubble.node).click(showPopup);

                    $(stateBubble.node).mouseleave(function(event) {
                        sensor.showingTooltip = false;
                        $('#screentooltip').remove();
                    });

                } else {
                    var stateBubble = paper.text(startx, ypositionmiddle + 10, '\uf27a');

                    stateBubble.attr({
                        "font": "Font Awesome 5 Free",
                        "stroke": color,
                        "fill": color,
                        "font-size": (strokewidth * 2) + "px"
                    });

                    stateBubble.node.style.fontFamily = '"Font Awesome 5 Free"';
                    stateBubble.node.style.fontWeight = "bold";

                    function showPopup() {
                        if (!sensor.tooltip) {
                            sensor.tooltipText = paper.text(startx, ypositionmiddle + 50, state.line1 + "\n" + (state.line2 ? state.line2 : ""));

                            var textDimensions = sensor.tooltipText.getBBox();

                            sensor.tooltip = paper.rect(textDimensions.x - 15, textDimensions.y - 15, textDimensions.width + 30, textDimensions.height + 30);
                            sensor.tooltip.attr({
                                "stroke": "black",
                                "stroke-width": 2,
                                "fill": "white",
                            });

                            sensor.tooltipText.toFront();
                        }
                    };

                    stateBubble.click(showPopup);

                    stateBubble.hover(showPopup, function () {
                        if (sensor.tooltip) {
                            sensor.tooltip.remove();
                            sensor.tooltip = null;
                        }
                        if (sensor.tooltipText) {
                            sensor.tooltipText.remove();
                            sensor.tooltipText = null;
                        }
                    });
                }
                drawnElements.push(stateBubble);
            } else {
                deleteLastDrawnElements = false;
            }
        } else if (percentage != 0) {
            if (type == "wrong" || type == "actual") {
                ypositionmiddle += 2;
            }

            if (type == "expected") {
                var c = paper.rect(startx, ypositionmiddle, stateLenght, strokewidth);
                c.attr({
                    "stroke": "none",
                    "fill": color,
                });

            } else {
                var c = paper.rect(startx, ypositionmiddle, 0, strokewidth);
                c.attr({
                    "stroke": "none",
                    "fill": color,
                });

                c.animate({ width: stateLenght }, 200);
            }
            drawnElements.push(c);
        }

        if (type == "wrong") {
            /*
            wrongindicator = paper.path(["M", startx,
                             sensor.drawInfo.y,
                        "L", startx + stateLenght,
                                sensor.drawInfo.y + sensor.drawInfo.height,

                        "M", startx,
                                sensor.drawInfo.y + sensor.drawInfo.height,
                        "L", startx + stateLenght,
                                   sensor.drawInfo.y
                            ]);

            wrongindicator.attr({
                "stroke-width": 5, "stroke" : "red", "stroke-linecap": "round" });*/
        }

        if(type == 'actual' || type == 'wrong') {
            if(!sensor.drawnGradingElements) {
                sensor.drawnGradingElements = [];
            } else if(deleteLastDrawnElements) {
                for(var i = 0; i < sensor.drawnGradingElements.length; i++) {
                    var dge = sensor.drawnGradingElements[i];
                    if(dge.time >= startTime) {
                        for(var j = 0; j < dge.elements.length; j++) {
                            dge.elements[j].remove();
                        }
                        sensor.drawnGradingElements.splice(i, 1);
                        i -= 1;
                    }
                }
            }
            if(drawnElements.length) {
                sensor.drawnGradingElements.push({time: startTime, elements: drawnElements});
            }
        }

        // Make sure the current time bar is always on top of states
        drawCurrentTime();
    }

    function getImg(filename) {
        // Get the path to an image stored in bebras-modules
        return (window.modulesPath ? window.modulesPath : '../../modules/') + 'img/quickpi/' + filename;
    }

    function createSlider(sensor, max, min, x, y, w, h, index)
    {
        var sliderobj = {};
        sliderobj.sliderdata = {};

        sliderobj.index = index;
        sliderobj.min = min;
        sliderobj.max = max;

        var outsiderectx = x;
        var outsiderecty = y;
        var outsidewidth = w / 6;
        var outsideheight = h;

        var insidewidth = outsidewidth / 6;
        sliderobj.sliderdata.insideheight = h * 0.60;

        var insiderectx = outsiderectx + (outsidewidth / 2) - (insidewidth / 2);
        sliderobj.sliderdata.insiderecty = outsiderecty + (outsideheight / 2) - (sliderobj.sliderdata.insideheight / 2);

        var circleradius = (outsidewidth / 2) - 1;

        var pluscirclex = outsiderectx + (outsidewidth / 2);
        var pluscircley = outsiderecty + circleradius + 1;

        var minuscirclex = pluscirclex;
        var minuscircley = outsiderecty + outsideheight - circleradius - 1;

        paper.setStart();

        sliderobj.sliderrect = paper.rect(outsiderectx, outsiderecty, outsidewidth, outsideheight, outsidewidth / 2);
        sliderobj.sliderrect.attr("fill", "#468DDF");
        sliderobj.sliderrect.attr("stroke", "#468DDF");

        sliderobj.sliderrect = paper.rect(insiderectx, sliderobj.sliderdata.insiderecty, insidewidth, sliderobj.sliderdata.insideheight, 2);
        sliderobj.sliderrect.attr("fill", "#2E5D94");
        sliderobj.sliderrect.attr("stroke", "#2E5D94");


        sliderobj.plusset = paper.set();

        sliderobj.pluscircle = paper.circle(pluscirclex, pluscircley, circleradius);
        sliderobj.pluscircle.attr("fill", "#F5A621");
        sliderobj.pluscircle.attr("stroke", "#F5A621");

        sliderobj.plus = paper.text(pluscirclex, pluscircley, "+");
        sliderobj.plus.attr({ fill: "white" });
        sliderobj.plus.node.style = "-moz-user-select: none; -webkit-user-select: none;";

        sliderobj.plusset.push(sliderobj.pluscircle, sliderobj.plus);

        sliderobj.plusset.click(function () {
            var step = 1;
            var sensorDef = findSensorDefinition(sensor);
            if (sensorDef.step)
                step = sensorDef.step;

            if (Array.isArray(sensor.state)) {
                if (sensor.state[sliderobj.index] < sliderobj.max)
                    sensor.state[sliderobj.index] += step;
            }
            else
            {
                if (sensor.state < sliderobj.max)
                    sensor.state += step;
            }

            drawSensor(sensor, true);
        });


        sliderobj.minusset = paper.set();

        sliderobj.minuscircle = paper.circle(minuscirclex, minuscircley, circleradius);
        sliderobj.minuscircle.attr("fill", "#F5A621");
        sliderobj.minuscircle.attr("stroke", "#F5A621");

        sliderobj.minus = paper.text(minuscirclex, minuscircley, "-");
        sliderobj.minus.attr({ fill: "white" });
        sliderobj.minus.node.style = "-moz-user-select: none; -webkit-user-select: none;";

        sliderobj.minusset.push(sliderobj.minuscircle, sliderobj.minus);

        sliderobj.minusset.click(function () {

            var step = 1;
            var sensorDef = findSensorDefinition(sensor);
            if (sensorDef.step)
                step = sensorDef.step;

            if (Array.isArray(sensor.state)) {
                if (sensor.state[sliderobj.index] > sliderobj.min)
                    sensor.state[sliderobj.index] -= step;
            } else {
                if (sensor.state > sliderobj.min)
                    sensor.state -= step;
            }

            drawSensor(sensor, true);
        });


        var thumbwidth = outsidewidth * .80;
        sliderobj.sliderdata.thumbheight = outsidewidth * 1.4;
        sliderobj.sliderdata.scale = (sliderobj.sliderdata.insideheight - sliderobj.sliderdata.thumbheight);


        if (Array.isArray(sensor.state)) {
            var percentage = findSensorDefinition(sensor).getPercentageFromState(sensor.state[index], sensor);
        } else {
            var percentage = findSensorDefinition(sensor).getPercentageFromState(sensor.state, sensor);
        }


        var thumby = sliderobj.sliderdata.insiderecty + sliderobj.sliderdata.insideheight - sliderobj.sliderdata.thumbheight - (percentage * sliderobj.sliderdata.scale);

        var thumbx = insiderectx + (insidewidth / 2) - (thumbwidth / 2);

        sliderobj.thumb = paper.rect(thumbx, thumby, thumbwidth, sliderobj.sliderdata.thumbheight, outsidewidth / 2);
        sliderobj.thumb.attr("fill", "#F5A621");
        sliderobj.thumb.attr("stroke", "#F5A621");

        sliderobj.slider = paper.setFinish();

        sliderobj.thumb.drag(
            function (dx, dy, x, y, event) {

                var newy = sliderobj.sliderdata.zero + dy;

                if (newy < sliderobj.sliderdata.insiderecty)
                    newy = sliderobj.sliderdata.insiderecty;

                if (newy > sliderobj.sliderdata.insiderecty + sliderobj.sliderdata.insideheight - sliderobj.sliderdata.thumbheight)
                    newy = sliderobj.sliderdata.insiderecty + sliderobj.sliderdata.insideheight - sliderobj.sliderdata.thumbheight;

                sliderobj.thumb.attr('y', newy);

                var percentage = 1 - ((newy - sliderobj.sliderdata.insiderecty) / sliderobj.sliderdata.scale);

                if (Array.isArray(sensor.state)) {
                    sensor.state[sliderobj.index] = findSensorDefinition(sensor).getStateFromPercentage(percentage);
                } else {
                    sensor.state = findSensorDefinition(sensor).getStateFromPercentage(percentage);
                }
                drawSensor(sensor, true);
            },
            function (x, y, event) {
                sliderobj.sliderdata.zero = sliderobj.thumb.attr('y');

            },
            function (event) {
            }
        );

        return sliderobj;
    }


    function setSlider(sensor, juststate, imgx, imgy, imgw, imgh, min, max, triaxial) {
        if (juststate) {

            if (Array.isArray(sensor.state)) {
                for (var i = 0; i < sensor.state.length; i++) {
                    if (sensor.sliders[i] == undefined)
                        continue;

                    var percentage = findSensorDefinition(sensor).getPercentageFromState(sensor.state[i], sensor);

                    thumby = sensor.sliders[i].sliderdata.insiderecty +
                        sensor.sliders[i].sliderdata.insideheight -
                        sensor.sliders[i].sliderdata.thumbheight -
                        (percentage * sensor.sliders[i].sliderdata.scale);

                    sensor.sliders[i].thumb.attr('y', thumby);
                }
            } else {
                var percentage = findSensorDefinition(sensor).getPercentageFromState(sensor.state, sensor);

                thumby = sensor.sliders[0].sliderdata.insiderecty +
                    sensor.sliders[0].sliderdata.insideheight -
                    sensor.sliders[0].sliderdata.thumbheight -
                    (percentage * sensor.sliders[0].sliderdata.scale);

                sensor.sliders[0].thumb.attr('y', thumby);
            }

            return;
        }

        removeSlider(sensor);


        sensor.sliders = [];

        var actuallydragged;

        sensor.hasslider = true;
        sensor.focusrect.drag(
            function (dx, dy, x, y, event) {
                if (sensor.sliders.length != 1)
                    return;

                var newy = sensor.sliders[0].sliderdata.zero + dy;

                if (newy < sensor.sliders[0].sliderdata.insiderecty)
                    newy = sensor.sliders[0].sliderdata.insiderecty;

                if (newy > sensor.sliders[0].sliderdata.insiderecty + sensor.sliders[0].sliderdata.insideheight - sensor.sliders[0].sliderdata.thumbheight)
                    newy = sensor.sliders[0].sliderdata.insiderecty + sensor.sliders[0].sliderdata.insideheight - sensor.sliders[0].sliderdata.thumbheight;

                sensor.sliders[0].thumb.attr('y', newy);

                var percentage = 1 - ((newy - sensor.sliders[0].sliderdata.insiderecty) / sensor.sliders[0].sliderdata.scale);

                sensor.state = findSensorDefinition(sensor).getStateFromPercentage(percentage);
                drawSensor(sensor, true);

                actuallydragged++;
            },
            function (x, y, event) {
                showSlider();
                actuallydragged = 0;

                if (sensor.sliders.length == 1)
                    sensor.sliders[0].sliderdata.zero = sensor.sliders[0].thumb.attr('y');
            },
            function (event) {
                if (actuallydragged > 4) {
                    hideSlider(sensor);
                }
            }
        );

        function showSlider() {
            hideSlider(sensorWithSlider);
            sensorWithSlider = sensor;

            if (Array.isArray(sensor.state)) {

                var offset = 0;
                var sign = -1;
                if (sensor.drawInfo.x -
                     ((sensor.state.length - 1) * sensor.drawInfo.width / 5) < 0)
                {
                    sign = 1;
                    offset = sensor.drawInfo.width;
                }


                for (var i = 0; i < sensor.state.length; i++) {
                    sliderobj = createSlider(sensor,
                        max,
                        min,
                        sensor.drawInfo.x + offset + (sign * i * sensor.drawInfo.width / 5) ,
                        sensor.drawInfo.y,
                        sensor.drawInfo.width,
                        sensor.drawInfo.height,
                        i);

                        sensor.sliders.push(sliderobj);
                }
            } else {
                sliderobj = createSlider(sensor,
                    max,
                    min,
                    sensor.drawInfo.x,
                    sensor.drawInfo.y,
                    sensor.drawInfo.width,
                    sensor.drawInfo.height,
                    0);
                sensor.sliders.push(sliderobj);
            }
        }
    }

    function removeSlider(sensor) {
        if (sensor.hasslider && sensor.focusrect) {
            sensor.focusrect.undrag();
            sensor.hasslider = false;
        }

        if (sensor.sliders) {

            for (var i = 0; i < sensor.sliders.length; i++) {
                sensor.sliders[i].slider.remove();
            }

            sensor.sliders = [];
        }
    }

    function sensorInConnectedModeError() {
        window.displayHelper.showPopupMessage(strings.messages.sensorInOnlineMode, 'blanket');
    }

    function actuatorsInRunningModeError() {
        window.displayHelper.showPopupMessage(strings.messages.actuatorsWhenRunning, 'blanket');
    }


    function drawSensor(sensor, juststate = false, donotmovefocusrect = false) {
        if (paper == undefined || !context.display || !sensor.drawInfo)
            return;

        var imgw = sensor.drawInfo.width / 2;
        var imgh = sensor.drawInfo.height / 2;

        var imgx = sensor.drawInfo.x + imgw / 6;
        var imgy = sensor.drawInfo.y + (sensor.drawInfo.height / 2) - (imgh / 2);

        var state1x =  (imgx + imgw) + 3;
        var state1y = imgy + imgh / 3;

        var portx = state1x;
        var porty = imgy;

        var namex = sensor.drawInfo.x + (sensor.drawInfo.height / 2);
        var namey = sensor.drawInfo.y + (imgh * 0.20);
        var nameanchor = "middle";

        var portsize = sensor.drawInfo.height * 0.10;
        var statesize = sensor.drawInfo.height * 0.09;
        var namesize = sensor.drawInfo.height * 0.10;

        var drawPortText = true;

        if (!sensor.focusrect || !sensor.focusrect.paper.canvas)
            sensor.focusrect = paper.rect(imgx, imgy, imgw, imgh);

        sensor.focusrect.attr({
                "fill": "468DDF",
                "fill-opacity": 0,
                "opacity": 0,
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
        });

        if (context.autoGrading) {
            imgw = sensor.drawInfo.width * .80;
            imgh = sensor.drawInfo.height * .80;

            imgx = sensor.drawInfo.x + imgw * 0.75;
            imgy = sensor.drawInfo.y + (sensor.drawInfo.height / 2) - (imgh / 2);

            state1x = imgx + imgw * 1.2;
            state1y = imgy + (imgh / 2);

            portx = sensor.drawInfo.x;
            porty = imgy + (imgh / 2);

            portsize = imgh / 3;
            statesize = sensor.drawInfo.height * 0.2;

            namex = portx;
            namesize = portsize;
            nameanchor = "start";
        }


        if (sensor.type == "led") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state == null)
                sensor.state = 0;

            if (!sensor.ledoff || !sensor.ledoff.paper.canvas) {
                sensor.ledoff = paper.image(getImg('ledoff.png'), imgx, imgy, imgw, imgh);

                    sensor.focusrect.click(function () {
                        if (!context.autoGrading && (!context.runner || !context.runner.isRunning())) {
                            sensor.state = !sensor.state;
                            drawSensor(sensor);
                        } else {
                            actuatorsInRunningModeError();
                        }
                    });
            }

            if (!sensor.ledon || !sensor.ledon.paper.canvas) {
                var imagename = "ledon-";
                if (sensor.subType)
                    imagename += sensor.subType;
                else
                    imagename += "red";

                imagename += ".png";

                sensor.ledon = paper.image(getImg(imagename), imgx, imgy, imgw, imgh);
            }


            sensor.ledon.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });
            sensor.ledoff.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.showAsAnalog)
            {
                sensor.stateText = paper.text(state1x, state1y, sensor.state);
            }
            else
            {
                if (sensor.state) {
                    sensor.stateText = paper.text(state1x, state1y, "ON");
                } else {
                    sensor.stateText = paper.text(state1x, state1y, "OFF");
                }
            }

            if (sensor.state) {
                sensor.ledon.attr({ "opacity": 1 });
                sensor.ledoff.attr({ "opacity": 0 });
            } else {
                sensor.ledon.attr({ "opacity": 0 });
                sensor.ledoff.attr({ "opacity": 1 });
            }

            var x = typeof sensor.state;

            if(typeof sensor.state == 'number' ) {
                sensor.ledon.attr({ "opacity": sensor.state });
                sensor.ledoff.attr({ "opacity": 1 });
            }


            if ((!context.runner || !context.runner.isRunning())
                && !context.offLineMode) {

                findSensorDefinition(sensor).setLiveState(sensor, sensor.state, function(x) {});
            }

        } else if (sensor.type == "buzzer") {           

            if(typeof sensor.state == 'number' &&
               sensor.state != 0 &&
               sensor.state != 1) {
                buzzerSound.start(sensor.name, sensor.state);
            } else if (sensor.state) {
                buzzerSound.start(sensor.name);
            } else {
                buzzerSound.stop(sensor.name);
            }

            if(!juststate) {
                if(sensor.muteBtn) {
                    sensor.muteBtn.remove();
                }
                

                var muteBtnSize = sensor.drawInfo.width * 0.15;
                sensor.muteBtn = paper.text(
                    state1x, 
                    state1y + imgh / 2, 
                    buzzerSound.isMuted(sensor.name) ? "\uf6a9" : "\uf028"
                );
                sensor.muteBtn.node.style.fontWeight = "bold";           
                sensor.muteBtn.node.style.cursor = "default";           
                sensor.muteBtn.node.style.MozUserSelect = "none";
                sensor.muteBtn.node.style.WebkitUserSelect = "none";
                sensor.muteBtn.attr({
                    "font-size": muteBtnSize + "px",                
                    fill: buzzerSound.isMuted(sensor.name) ? "lightgray" : "#468DDF",
                    "font-family": '"Font Awesome 5 Free"',
                    'text-anchor': 'start'
                });            
                sensor.muteBtn.click(function () {
                    if(buzzerSound.isMuted(sensor.name)) {
                        buzzerSound.unmute(sensor.name)
                    } else {
                        buzzerSound.mute(sensor.name)
                    }
                    drawSensor(sensor);
                });
            }            


            if (!sensor.buzzeron || !sensor.buzzeron.paper.canvas)
                sensor.buzzeron = paper.image(getImg('buzzer-ringing.png'), imgx, imgy, imgw, imgh);

            if (!sensor.buzzeroff || !sensor.buzzeroff.paper.canvas) {
                sensor.buzzeroff = paper.image(getImg('buzzer.png'), imgx, imgy, imgw, imgh);

                    sensor.focusrect.click(function () {
                        if (!context.autoGrading && (!context.runner || !context.runner.isRunning())) {
                            sensor.state = !sensor.state;
                            drawSensor(sensor);
                        } else {
                            actuatorsInRunningModeError();
                        }
                    });
            }

            if (sensor.state) {
                if (!sensor.buzzerInterval) {
                    sensor.buzzerInterval = setInterval(function () {

                        if (!sensor.removed) {
                            sensor.ringingState = !sensor.ringingState;
                            drawSensor(sensor, true, true);
                        } else {
                            clearInterval(sensor.buzzerInterval);
                        }

                    }, 100);
                }
            } else {
                if (sensor.buzzerInterval) {
                    clearInterval(sensor.buzzerInterval);
                    sensor.buzzerInterval = null;
                    sensor.ringingState = null;
                }
            }
            sensor.buzzeron.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });
            sensor.buzzeroff.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            var drawState = sensor.state;
            if (sensor.ringingState != null)
                drawState = sensor.ringingState;

            if (drawState) {
                sensor.buzzeron.attr({ "opacity": 1 });
                sensor.buzzeroff.attr({ "opacity": 0 });


            } else {
                sensor.buzzeron.attr({ "opacity": 0 });
                sensor.buzzeroff.attr({ "opacity": 1 });
            }

            if (sensor.stateText)
                sensor.stateText.remove();

            var stateText = findSensorDefinition(sensor).getStateString(sensor.state);

            sensor.stateText = paper.text(state1x, state1y, stateText);


            if ((!context.runner || !context.runner.isRunning())
                && !context.offLineMode) {

                var setLiveState = findSensorDefinition(sensor).setLiveState;

                if (setLiveState) {
                    setLiveState(sensor, sensor.state, function(x) {});
                }
            }

        } else if (sensor.type == "button") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.buttonon || !sensor.buttonon.paper.canvas)
                sensor.buttonon = paper.image(getImg('buttonon.png'), imgx, imgy, imgw, imgh);

            if (!sensor.buttonoff || !sensor.buttonoff.paper.canvas)
                sensor.buttonoff = paper.image(getImg('buttonoff.png'), imgx, imgy, imgw, imgh);

            if (sensor.state == null)
                sensor.state = false;

            sensor.buttonon.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });
            sensor.buttonoff.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.state) {
                sensor.buttonon.attr({ "opacity": 1 });
                sensor.buttonoff.attr({ "opacity": 0 });

                sensor.stateText = paper.text(state1x, state1y, "ON");
            } else {
                sensor.buttonon.attr({ "opacity": 0 });
                sensor.buttonoff.attr({ "opacity": 1 });

                sensor.stateText = paper.text(state1x, state1y, "OFF");
            }

            if (!context.autoGrading && !sensor.buttonon.node.onmousedown) {
                sensor.focusrect.node.onmousedown = function () {
                    if (context.offLineMode) {
                        sensor.state = true;
                        drawSensor(sensor);
                    } else
                        sensorInConnectedModeError();
                };


                sensor.focusrect.node.onmouseup = function () {
                    if (context.offLineMode) {
                        sensor.state = false;
                        sensor.wasPressed = true;
                        drawSensor(sensor);

                        if (sensor.onPressed)
                            sensor.onPressed();
                    } else
                        sensorInConnectedModeError();
                }

                sensor.focusrect.node.ontouchstart = sensor.focusrect.node.onmousedown;
                sensor.focusrect.node.ontouchend = sensor.focusrect.node.onmouseup;
            }
        } else if (sensor.type == "screen") {
            if (sensor.stateText) {
                sensor.stateText.remove();
                sensor.stateText = null;
            }

            var borderSize = 5;

            var screenScale = 2;
            if(sensor.drawInfo.width < 300) {
                screenScale = 1;
            }
            if(sensor.drawInfo.width < 150) {
                screenScale = 0.5;
            }             

            var screenScalerSize = {
                width: 128 * screenScale,
                height: 32 * screenScale
            }
            borderSize = borderSize * screenScale;

            imgw = screenScalerSize.width + borderSize * 2;
            imgh = screenScalerSize.height + borderSize * 2;            
            imgx = sensor.drawInfo.x + Math.max(0, (sensor.drawInfo.width - imgw) * 0.5);
            imgy = sensor.drawInfo.y + Math.max(0, (sensor.drawInfo.height - imgh) * 0.5);            

            portx = imgx + imgw + borderSize;
            porty = imgy + imgh / 3;
/*
            if (context.autoGrading) {
                state1x = imgx + imgw;
                state1y = imgy + (imgh / 2);

                portsize = imgh / 4;
                statesize = imgh / 6;
            }
            */
            statesize = imgh / 3.5;

            if (!sensor.img || !sensor.img.paper.canvas) {
                sensor.img = paper.image(getImg('screen.png'), imgx, imgy, imgw, imgh);
            }
               


            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });


            if (sensor.state) {
                if (sensor.state.isDrawingData) {
                    if (!sensor.screenrect || !sensor.screenrect.paper.canvas) {
                        sensor.screenrect = paper.rect(imgx, imgy, screenScalerSize.width, screenScalerSize.height);
        
                        sensor.canvasNode = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
                        sensor.canvasNode.setAttribute("x",imgx + borderSize); //Set rect data
                        sensor.canvasNode.setAttribute("y",imgy + borderSize); //Set rect data
                        sensor.canvasNode.setAttribute("width", screenScalerSize.width); //Set rect data
                        sensor.canvasNode.setAttribute("height", screenScalerSize.height); //Set rect data
                        paper.canvas.appendChild(sensor.canvasNode);
        
                        sensor.canvas = document.createElement("canvas");
                        sensor.canvas.id = "screencanvas";
                        sensor.canvas.width = screenScalerSize.width;
                        sensor.canvas.height = screenScalerSize.height;
                        sensor.canvasNode.appendChild(sensor.canvas);
                    }

                    sensor.canvasNode.setAttribute("x", imgx + borderSize); //Set rect data
                    sensor.canvasNode.setAttribute("y", imgy + borderSize); //Set rect data
                    sensor.canvasNode.setAttribute("width", screenScalerSize.width); //Set rect data
                    sensor.canvasNode.setAttribute("height", screenScalerSize.height); //Set rect data

                    sensor.screenrect.attr({
                        "x": imgx + borderSize,
                        "y": imgy + borderSize,
                        "width": 128,
                        "height": 32,
                    });
        
                    sensor.screenrect.attr({ "opacity": 0 });
        

                    sensor.screenDrawing.copyToCanvas(sensor.canvas, screenScale);
                } else {
                    var statex = imgx + (imgw * .05);

                    var statey = imgy + (imgh * .2);

                    if (sensor.state.line1.length > 16)
                        sensor.state.line1 = sensor.state.line1.substring(0, 16);

                    if (sensor.state.line2 && sensor.state.line2.length > 16)
                        sensor.state.line2 = sensor.state.line2.substring(0, 16);

                    sensor.stateText = paper.text(statex, statey, sensor.state.line1 + "\n" + (sensor.state.line2 ? sensor.state.line2 : ""));

                    sensor.stateText.attr("")
                }
            }
        } else if (sensor.type == "temperature") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state == null)
                sensor.state = 25; // FIXME

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('temperature-cold.png'), imgx, imgy, imgw, imgh);

            if (!sensor.img2 || !sensor.img2.paper.canvas)
                sensor.img2 = paper.image(getImg('temperature-hot.png'), imgx, imgy, imgw, imgh);

            if (!sensor.img3 || !sensor.img3.paper.canvas)
                sensor.img3 = paper.image(getImg('temperature-overlay.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });
            sensor.img2.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            sensor.img3.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            var scale = imgh / 60;

            var cliph = scale * sensor.state;

            sensor.img2.attr({
                "clip-rect":
                    imgx + "," +
                    (imgy + imgh - cliph) + "," +
                    (imgw) + "," +
                    cliph
            });

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "C");

            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, 0, 60);
            }
            else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }

        } else if (sensor.type == "servo") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('servo.png'), imgx, imgy, imgw, imgh);

            if (!sensor.pale || !sensor.pale.paper.canvas)
                sensor.pale = paper.image(getImg('servo-pale.png'), imgx, imgy, imgw, imgh);


            if (!sensor.center || !sensor.center.paper.canvas)
                sensor.center = paper.image(getImg('servo-center.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });
            sensor.pale.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "transform": ""
            });
            sensor.center.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            sensor.pale.rotate(sensor.state);

            if (sensor.state == null)
                sensor.state = 0;

            sensor.state = Math.round(sensor.state);

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "°");

            if ((!context.runner || !context.runner.isRunning())
                && !context.offLineMode) {
                if (!sensor.updatetimeout) {
                    sensor.updatetimeout = setTimeout(function () {

                        findSensorDefinition(sensor).setLiveState(sensor, sensor.state, function(x) {});

                        sensor.updatetimeout = null;
                    }, 100);
                }
            }

            if (!context.autoGrading &&
                (!context.runner || !context.runner.isRunning())) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, 0, 180);
            } else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }
        } else if (sensor.type == "potentiometer") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('potentiometer.png'), imgx, imgy, imgw, imgh);

            if (!sensor.pale || !sensor.pale.paper.canvas)
                sensor.pale = paper.image(getImg('potentiometer-pale.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            sensor.pale.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "transform": ""
            });

            if (sensor.state == null)
                sensor.state = 0;

            sensor.pale.rotate(sensor.state * 3.6);

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "%");

            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, 0, 100);
            } else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }

        } else if (sensor.type == "range") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('range.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.state == null)
                sensor.state = 500;

            if (sensor.rangedistance)
                sensor.rangedistance.remove();

            if (sensor.rangedistancestart)
                sensor.rangedistancestart.remove();

            if (sensor.rangedistanceend)
                sensor.rangedistanceend.remove();

            var rangew;

            if (sensor.state < 30) {
                rangew = imgw * sensor.state / 100;
            } else {
                var firstpart = imgw * 30 / 100;
                var remaining = imgw - firstpart;

                rangew = firstpart + (remaining * (sensor.state) * 0.0015);
            }

            var centerx = imgx + (imgw / 2);

            sensor.rangedistance = paper.path(["M", centerx - (rangew / 2),
                imgy + imgw,
                "L", centerx + (rangew / 2),
                imgy + imgw]);

            var markh = 16;

            sensor.rangedistancestart = paper.path(["M", centerx - (rangew / 2),
                imgy + imgw - (markh / 2),
                "L", centerx - (rangew / 2),
                imgy + imgw + (markh / 2)]);

            sensor.rangedistanceend = paper.path(["M", centerx + (rangew / 2),
                imgy + imgw - (markh / 2),
                "L", centerx + (rangew / 2),
                imgy + imgw + (markh / 2)]);

            sensor.rangedistance.attr({
                "stroke-width": 4,
                "stroke": "#468DDF",
                "stroke-linecapstring": "round"
            });

            sensor.rangedistancestart.attr({
                "stroke-width": 4,
                "stroke": "#468DDF",
                "stroke-linecapstring": "round"
            });


            sensor.rangedistanceend.attr({
                "stroke-width": 4,
                "stroke": "#468DDF",
                "stroke-linecapstring": "round"
            });

            if (sensor.state >= 10)
                sensor.state = Math.round(sensor.state);

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "cm");
            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, 0, 500);
            } else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }
        } else if (sensor.type == "light") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('light.png'), imgx, imgy, imgw, imgh);

            if (!sensor.moon || !sensor.moon.paper.canvas)
                sensor.moon = paper.image(getImg('light-moon.png'), imgx, imgy, imgw, imgh);

            if (!sensor.sun || !sensor.sun.paper.canvas)
                sensor.sun = paper.image(getImg('light-sun.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.state == null)
                sensor.state = 0;

            if (sensor.state > 50) {
                var opacity = (sensor.state - 50) * 0.02;
                sensor.sun.attr({
                    "x": imgx,
                    "y": imgy,
                    "width": imgw,
                    "height": imgh,
                    "opacity": opacity * .80
                });
                sensor.moon.attr({ "opacity": 0 });
            }
            else {
                var opacity = (50 - sensor.state) * 0.02;
                sensor.moon.attr({
                    "x": imgx,
                    "y": imgy,
                    "width": imgw,
                    "height": imgh,
                    "opacity": opacity * .80
                });
                sensor.sun.attr({ "opacity": 0 });
            }

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "%");
            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, 0, 100);
            } else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }
        } else if (sensor.type == "humidity") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('humidity.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.state == null)
                sensor.state = 0;

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "%");
            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, 0, 100);
            } else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }
        } else if (sensor.type == "accelerometer") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('accel.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });


            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.state)
            {
                sensor.state = [0, 0, 1];
            }

            if (sensor.state) {
                try {
                sensor.stateText = paper.text(state1x, state1y, "X: " + sensor.state[0] + "m/s²\nY: " + sensor.state[1] + "m/s²\nZ: " + sensor.state[2] + "m/s²");
                } catch (Err)
                {
                    var a = 1;
                }
            }

            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, -8 * 9.81, 8 * 9.81);
            } else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }
        } else if (sensor.type == "gyroscope") {
            if (!sensor.state) {
                sensor.state = [0, 0, 0];
            }
            if (sensor.stateText) {
                sensor.stateText.remove();
            }
            sensor.stateText = paper.text(state1x, state1y, "X: " + sensor.state[0] + "°/s\nY: " + sensor.state[1] + "°/s\nZ: " + sensor.state[2] + "°/s");

            if (!context.autoGrading && context.offLineMode) {
                var img3d = gyroscope3D.getInstance(imgw, imgh);
            }
            if(img3d) {
                if (!sensor.screenrect || !sensor.screenrect.paper.canvas) {
                    sensor.screenrect = paper.rect(imgx, imgy, imgw, imgh);
                    sensor.screenrect.attr({ "opacity": 0 });
    
                    sensor.canvasNode = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
                    sensor.canvasNode.setAttribute("x", imgx);
                    sensor.canvasNode.setAttribute("y", imgy);
                    sensor.canvasNode.setAttribute("width", imgw);
                    sensor.canvasNode.setAttribute("height", imgh);
                    paper.canvas.appendChild(sensor.canvasNode);
    
                    sensor.canvas = document.createElement("canvas");
                    sensor.canvas.width = imgw;
                    sensor.canvas.height = imgh;
                    sensor.canvasNode.appendChild(sensor.canvas);
                }

                var sensorCtx = sensor.canvas.getContext('2d');
                sensorCtx.clearRect(0, 0, imgw, imgh);
                
                sensorCtx.drawImage(img3d.render(                
                    sensor.state[0], 
                    sensor.state[2],
                    sensor.state[1]
                ), 0, 0);

                if(!juststate) {
                    sensor.focusrect.drag(
                        function(dx, dy, x, y, event) {
                            sensor.state[0] = Math.max(-125, Math.min(125, sensor.old_state[0] + dy));
                            sensor.state[1] = Math.max(-125, Math.min(125, sensor.old_state[1] - dx));
                            drawSensor(sensor, true)
                        },
                        function() {
                            sensor.old_state = sensor.state.slice();
                        }
                    );
                }

            } else {
                if (!sensor.img || !sensor.img.paper.canvas) {
                    sensor.img = paper.image(getImg('gyro.png'), imgx, imgy, imgw, imgh);
                }
                sensor.img.attr({
                    "x": imgx,
                    "y": imgy,
                    "width": imgw,
                    "height": imgh,
                });
                if (!context.autoGrading && context.offLineMode) {
                    setSlider(sensor, juststate, imgx, imgy, imgw, imgh, -125, 125);
                } else {
                    sensor.focusrect.click(function () {
                        sensorInConnectedModeError();
                    });
    
                    removeSlider(sensor);
                }                            
            }            
        } else if (sensor.type == "magnetometer") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('mag.png'), imgx, imgy, imgw, imgh);

            if (!sensor.needle || !sensor.needle.paper.canvas)
                sensor.needle = paper.image(getImg('mag-needle.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            sensor.needle.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "transform": ""
            });

            if (!sensor.state)
            {
                sensor.state = [0, 0, 0];
            }

            if (sensor.state) {
                var heading = Math.atan2(sensor.state[0],sensor.state[1])*(180/Math.PI) + 180;

                sensor.needle.rotate(heading);
            }

            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                sensor.stateText = paper.text(state1x, state1y, "X: " + sensor.state[0] + "μT\nY: " + sensor.state[1] + "μT\nZ: " + sensor.state[2] + "μT");
            }

            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, -1600, 1600);
            } else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }
        } else if (sensor.type == "sound") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state == null)
                sensor.state = 25; // FIXME

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('sound.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                sensor.stateText = paper.text(state1x, state1y, sensor.state);
            }

            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, 0, 60);
            }
            else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }

        } else if (sensor.type == "irtrans") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.ledon || !sensor.ledon.paper.canvas) {
                sensor.ledon = paper.image(getImg("irtranson.png"), imgx, imgy, imgw, imgh);
            }

            if (!sensor.ledoff || !sensor.ledoff.paper.canvas) {
                sensor.ledoff = paper.image(getImg('irtransoff.png'), imgx, imgy, imgw, imgh);

                    sensor.focusrect.click(function () {
                        if (!context.autoGrading && (!context.runner || !context.runner.isRunning())) {
                            sensor.state = !sensor.state;
                            drawSensor(sensor);
                        } else {
                            actuatorsInRunningModeError();
                        }
                    });
            }

            sensor.ledon.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });
            sensor.ledoff.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.state) {
                sensor.ledon.attr({ "opacity": 1 });
                sensor.ledoff.attr({ "opacity": 0 });

                sensor.stateText = paper.text(state1x, state1y, "ON");
            } else {
                sensor.ledon.attr({ "opacity": 0 });
                sensor.ledoff.attr({ "opacity": 1 });

                sensor.stateText = paper.text(state1x, state1y, "OFF");
            }


            if ((!context.runner || !context.runner.isRunning())
                && !context.offLineMode) {

                findSensorDefinition(sensor).setLiveState(sensor, sensor.state, function(x) {});
            }
        } else if (sensor.type == "irrecv") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.buttonon || !sensor.buttonon.paper.canvas)
                sensor.buttonon = paper.image(getImg('irrecvon.png'), imgx, imgy, imgw, imgh);

            if (!sensor.buttonoff || !sensor.buttonoff.paper.canvas)
                sensor.buttonoff = paper.image(getImg('irrecvoff.png'), imgx, imgy, imgw, imgh);

            sensor.buttonon.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });
            sensor.buttonoff.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.state) {
                sensor.buttonon.attr({ "opacity": 1 });
                sensor.buttonoff.attr({ "opacity": 0 });

                sensor.stateText = paper.text(state1x, state1y, "ON");
            } else {
                sensor.buttonon.attr({ "opacity": 0 });
                sensor.buttonoff.attr({ "opacity": 1 });

                sensor.stateText = paper.text(state1x, state1y, "OFF");
            }
        } else if (sensor.type == "stick") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('stick.png'), imgx, imgy, imgw, imgh);

            if (!sensor.imgup || !sensor.imgup.paper.canvas)
                sensor.imgup = paper.image(getImg('stickup.png'), imgx, imgy, imgw, imgh);

            if (!sensor.imgdown || !sensor.imgdown.paper.canvas)
                sensor.imgdown = paper.image(getImg('stickdown.png'), imgx, imgy, imgw, imgh);

            if (!sensor.imgleft || !sensor.imgleft.paper.canvas)
                sensor.imgleft = paper.image(getImg('stickleft.png'), imgx, imgy, imgw, imgh);

            if (!sensor.imgright || !sensor.imgright.paper.canvas)
                sensor.imgright = paper.image(getImg('stickright.png'), imgx, imgy, imgw, imgh);

            if (!sensor.imgcenter || !sensor.imgcenter.paper.canvas)
                sensor.imgcenter = paper.image(getImg('stickcenter.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            sensor.imgup.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": 0,
            });
            sensor.imgdown.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": 0,
            });
            sensor.imgleft.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": 0,
            });
            sensor.imgright.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": 0,
            });
            sensor.imgcenter.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": 0,
            });

            if (sensor.stateText)
               sensor.stateText.remove();

            if (!sensor.state)
                sensor.state = [false, false, false, false, false];

            var stateString = "";
            if (sensor.state[0]) {
                stateString += "UP\n"
                sensor.imgup.attr({ "opacity": 1 });
            }
            if (sensor.state[1]) {
                stateString += "DOWN\n"
                sensor.imgdown.attr({ "opacity": 1 });
            }
            if (sensor.state[2]) {
                stateString += "LEFT\n"
                sensor.imgleft.attr({ "opacity": 1 });
            }
            if (sensor.state[3]) {
                stateString += "RIGHT\n"
                sensor.imgright.attr({ "opacity": 1 });
            }
            if (sensor.state[4]) {
                stateString += "CENTER\n"
                sensor.imgcenter.attr({ "opacity": 1 });
            }

            sensor.stateText = paper.text(state1x, state1y, stateString);

            if (sensor.portText)
                sensor.portText.remove();

            drawPortText = false;

            if (sensor.portText)
                sensor.portText.remove();

            if (!context.autoGrading) {
                var gpios = findSensorDefinition(sensor).gpios;
                var min = 255;
                var max = 0;

                for (var i = 0; i < gpios.length; i++) {
                    if (gpios[i] > max)
                        max = gpios[i];

                    if (gpios[i] < min)
                        min = gpios[i];
                }

                sensor.portText = paper.text(portx, porty, "D" + min.toString() + "-D" + max.toString() + "?");
                sensor.portText.attr({ "font-size": portsize + "px", 'text-anchor': 'start', fill: "blue" });
                sensor.portText.node.style = "-moz-user-select: none; -webkit-user-select: none;";
                var b = sensor.portText._getBBox();
                sensor.portText.translate(0, b.height / 2);

                $('#stickupstate').text(sensor.state[0] ? "ON" : "OFF");
                $('#stickdownstate').text(sensor.state[1] ? "ON" : "OFF");
                $('#stickleftstate').text(sensor.state[2] ? "ON" : "OFF");
                $('#stickrightstate').text(sensor.state[3] ? "ON" : "OFF");
                $('#stickcenterstate').text(sensor.state[4] ? "ON" : "OFF");


                sensor.portText.click(function () {
                    window.displayHelper.showPopupDialog(strings.messages.stickPortsDialog);

                    $('#picancel').click(function () {
                        $('#popupMessage').hide();
                        window.displayHelper.popupMessageShown = false;
                    });

                    $('#picancel2').click(function () {
                        $('#popupMessage').hide();
                        window.displayHelper.popupMessageShown = false;
                    });

                    $('#stickupname').text(sensor.name + ".up");
                    $('#stickdownname').text(sensor.name + ".down");
                    $('#stickleftname').text(sensor.name + ".left");
                    $('#stickrightname').text(sensor.name + ".right");
                    $('#stickcentername').text(sensor.name + ".center");

                    $('#stickupport').text("D" + gpios[0]);
                    $('#stickdownport').text("D" + gpios[1]);
                    $('#stickleftport').text("D" + gpios[2]);
                    $('#stickrightport').text("D" + gpios[3]);
                    $('#stickcenterport').text("D" + gpios[4]);

                    $('#stickupstate').text(sensor.state[0] ? "ON" : "OFF");
                    $('#stickdownstate').text(sensor.state[1] ? "ON" : "OFF");
                    $('#stickleftstate').text(sensor.state[2] ? "ON" : "OFF");
                    $('#stickrightstate').text(sensor.state[3] ? "ON" : "OFF");
                    $('#stickcenterstate').text(sensor.state[4] ? "ON" : "OFF");

                });
            }


            function poinInRect(rect, x, y) {

                if (x > rect.left && x < rect.right && y > rect.top  && y < rect.bottom)
                    return true;

                return false;
            }

            function moveRect(rect, x, y) {
                rect.left += x;
                rect.right += x;

                rect.top += y;
                rect.bottom += y;
            }

            sensor.focusrect.node.onmousedown = function(evt) {
                if (!context.offLineMode) {
                    sensorInConnectedModeError();
                    return;
                }

                var e = evt.target;
                var dim = e.getBoundingClientRect();
                var rectsize = dim.width * .30;


                var rect = {
                    left: dim.left,
                    right: dim.left + rectsize,
                    top: dim.top,
                    bottom: dim.top + rectsize,
                }

                // Up left
                if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[0] = true;
                    sensor.state[2] = true;
                }

                // Up
                 moveRect(rect, rectsize, 0);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[0] = true;
                 }

                 // Up right
                 moveRect(rect, rectsize, 0);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[0] = true;
                    sensor.state[3] = true;
                 }

                 // Right
                 moveRect(rect, 0, rectsize);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[3] = true;
                 }

                 // Center
                 moveRect(rect, -rectsize, 0);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[4] = true;
                 }

                 // Left
                 moveRect(rect, -rectsize, 0);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[2] = true;
                 }

                 // Down left
                 moveRect(rect, 0, rectsize);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[1] = true;
                    sensor.state[2] = true;
                 }

                 // Down
                 moveRect(rect, rectsize, 0);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[1] = true;
                 }

                 // Down right
                 moveRect(rect, rectsize, 0);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[1] = true;
                    sensor.state[3] = true;
                 }

                 drawSensor(sensor);
            }

            sensor.focusrect.node.onmouseup = function(evt) {
                if (!context.offLineMode) {
                    sensorInConnectedModeError();
                    return;
                }

                sensor.state = [false, false, false, false, false];
                drawSensor(sensor);
            }

            sensor.focusrect.node.ontouchstart = sensor.focusrect.node.onmousedown;
            sensor.focusrect.node.ontouchend = sensor.focusrect.node.onmouseup;
        }


        sensor.focusrect.mousedown(function () {
            if (infos.customSensors && !context.autoGrading) {
                if (context.removerect) {
                    context.removerect.remove();
                }

                if (!context.runner || !context.runner.isRunning()) {
                context.removerect = paper.text(portx, imgy, "\uf00d"); // fa-times char
                removeRect = context.removerect;
                sensorWithRemoveRect = sensor;

                context.removerect.attr({
                    "font-size": "30" + "px",
                    fill: "lightgray",
                    "font-family": "Font Awesome 5 Free",
                    'text-anchor': 'start',
                    "x": portx,
                    "y": imgy,
                });

                context.removerect.node.style = "-moz-user-select: none; -webkit-user-select: none;";
                context.removerect.node.style.fontFamily = '"Font Awesome 5 Free"';
                context.removerect.node.style.fontWeight = "bold";


                context.removerect.click(function (element) {

                    window.displayHelper.showPopupMessage(strings.messages.removeConfirmation,
                        'blanket',
                        strings.messages.remove,
                        function () {
                            for (var i = 0; i < infos.quickPiSensors.length; i++) {
                                if (infos.quickPiSensors[i] === sensor) {
                                    sensor.removed = true;
                                    infos.quickPiSensors.splice(i, 1);
                                }
                            }
                            context.resetDisplay();
                        },
                        strings.messages.keep);
                });
            }
            }
        });


        if (sensor.stateText) {
            try {
                sensor.stateText.attr({ "font-size": statesize + "px", 'text-anchor': 'start', 'font-weight': 'bold', fill: "gray" });
                var b = sensor.stateText._getBBox();
                sensor.stateText.translate(0, b.height/2);
                sensor.stateText.node.style = "-moz-user-select: none; -webkit-user-select: none;";
            } catch (err) {
            }
        }


		if (drawPortText) {
        	if (sensor.portText)
            	sensor.portText.remove();

        	sensor.portText = paper.text(portx, porty, sensor.port);
        	sensor.portText.attr({ "font-size": portsize + "px", 'text-anchor': 'start', fill: "gray" });
        	sensor.portText.node.style = "-moz-user-select: none; -webkit-user-select: none;";
        	var b = sensor.portText._getBBox();
        	sensor.portText.translate(0,b.height/2);
		}

        if (sensor.nameText) {
            sensor.nameText.remove();
        }


        if (sensor.name) {
            sensor.nameText = paper.text(namex, namey, sensor.name );
            sensor.nameText.attr({ "font-size": namesize + "px", 'text-anchor': nameanchor, fill: "#7B7B7B" });
            sensor.nameText.node.style = "-moz-user-select: none; -webkit-user-select: none;";
        }


        if (!donotmovefocusrect) {
            // This needs to be in front of everything
            sensor.focusrect.toFront();
        }

    }


    context.registerQuickPiEvent = function (name, newState, setInSensor = true, allowFail = false) {
        var sensor = findSensorByName(name);
        if (!sensor) {
            context.success = false;
            throw (strings.messages.sensorNotFound.format(name));
        }

        if (setInSensor) {
            sensor.state = newState;
            drawSensor(sensor);
        }

        if (context.autoGrading && context.gradingStatesBySensor != undefined) {
            var fail = false;
            var type = "actual";

            if(!context.actualStatesBySensor[name]) {
                context.actualStatesBySensor[name] = [];
            }
            var actualStates = context.actualStatesBySensor[name];

            var lastRealState = actualStates.length > 0 ? actualStates[actualStates.length-1] : null;
            if(lastRealState) {
                if(lastRealState.time == context.currentTime) {
                    lastRealState.state = newState;
                } else {
                    actualStates.push({time: context.currentTime, state: newState});
                }
            } else {
                actualStates.push({time: context.currentTime, state: newState});
            }

            drawNewStateChangesSensor(name, newState);

            context.increaseTime(sensor);
        }
    }

    function drawNewStateChangesSensor(name, newState=null) {
        var sensor = findSensorByName(name);
        if (!sensor) {
            context.success = false;
            throw (strings.messages.sensorNotFound.format(name));
        }

        var sensorDef = findSensorDefinition(sensor);
        if(sensor.lastDrawnState !== null) {
            // Get all states between the last drawn time and now
            var expectedStates = context.getSensorExpectedState(name, sensor.lastDrawnTime, context.currentTime);
            for(var i = 0; expectedStates && i < expectedStates.length; i++) {
                // Draw the line up to the next expected state
                var expectedState = expectedStates[i];
                var nextTime = i+1 < expectedStates.length ? expectedStates[i+1].time : context.currentTime;
                var type = "actual";
                // Check the previous state
                if(!sensorDef.compareState(sensor.lastDrawnState, expectedState.state)) {
                    type = "wrong";
                }
                drawSensorTimeLineState(sensor, sensor.lastDrawnState, sensor.lastDrawnTime, nextTime, type, false, expectedState.state);
                sensor.lastDrawnTime = nextTime;
            }
        }

        sensor.lastDrawnTime = context.currentTime;

        if(newState !== null && sensor.lastDrawnState != newState) {
            // Draw the new state change
            if(sensor.lastDrawnState === null) {
                sensor.lastDrawnState = newState;
            }

            var type = "actual";
            // Check the new state
            var expectedState = context.getSensorExpectedState(name, context.currentTime);

            if (expectedState !== null && !sensorDef.compareState(expectedState.state, newState))
            {
                type = "wrong";
            }
            drawSensorTimeLineState(sensor, newState, context.currentTime, context.currentTime, type, false, expectedState && expectedState.state);
            sensor.lastDrawnState = newState;
        }
    }

    function drawNewStateChanges() {
        // Draw all sensors
        if(!context.gradingStatesBySensor) { return; }
        for(var sensorName in context.gradingStatesBySensor) {
            drawNewStateChangesSensor(sensorName);
        }
    }

    context.increaseTime = function (sensor) {
        if (!sensor.lastTimeIncrease) {
            sensor.lastTimeIncrease = 0;
        }

        if (sensor.callsInTimeSlot == undefined)
            sensor.callsInTimeSlot = 0;

        if (sensor.lastTimeIncrease == context.currentTime) {
            sensor.callsInTimeSlot += 1;
        }
        else {
            sensor.lastTimeIncrease = context.currentTime;
            sensor.callsInTimeSlot = 1;
        }

        if (sensor.callsInTimeSlot > getQuickPiOption('increaseTimeAfterCalls')) {
            context.currentTime += context.tickIncrease;

            sensor.lastTimeIncrease = context.currentTime;
            sensor.callsInTimeSlot = 0;
        }

        drawCurrentTime();
        if(context.autoGrading)
        {
            drawNewStateChanges();
        }

        if(context.runner) {
            // Tell the runner an "action" happened
            context.runner.signalAction();
        }
    }

    context.increaseTimeBy = function (time) {

        var iStates = 0;

        var newTime = context.currentTime + time;

        if (context.gradingStatesByTime) {
            // Advance until current time, ignore everything in the past.
            while (iStates < context.gradingStatesByTime.length &&
                context.gradingStatesByTime[iStates].time < context.currentTime)
                iStates++;

            for (; iStates < context.gradingStatesByTime.length; iStates++) {
                var sensorState = context.gradingStatesByTime[iStates];

                // Until the new time
                if (sensorState.time >= newTime)
                    break;

                // Mark all inputs as hit
                if (sensorState.input) {
                    sensorState.hit = true;
    //                context.currentTime = sensorState.time;
                    context.getSensorState(sensorState.name);
                }
            }
        }

        if(context.runner) {
            // Tell the runner an "action" happened
            context.runner.signalAction();
        }

        context.currentTime = newTime;

        drawCurrentTime();
        if (context.autoGrading) {
            drawNewStateChanges();
        }
    }

    context.getSensorExpectedState = function (name, targetTime = null, upToTime = null) {
        var state = null;
        if(targetTime === null) {
            targetTime = context.currentTime;
        }

        if (!context.gradingStatesBySensor)
        {
            return null;
        }

        var actualname = name;
        var parts = name.split(".");
        if (parts.length == 2) {
            actualname = parts[0];
        }

        var sensorStates = context.gradingStatesBySensor[actualname];

        if (!sensorStates)
            return null; // Fail??

        var lastState;
        var startTime = -1;
        for (var idx = 0; idx < sensorStates.length; idx++) {
            if (startTime >= 0
                && targetTime >= startTime
                && targetTime < sensorStates[idx].time) {
                    state = lastState;
                    break;
            }

            startTime = sensorStates[idx].time;
            lastState = sensorStates[idx];
        }

        // This is the end state
        if(state === null && targetTime >= startTime) {
            state = lastState;
        }

        if(state && upToTime !== null) {
            // If upToTime is given, return an array of states instead
            var states = [state];
            for(var idx2 = idx+1; idx2 < sensorStates.length; idx2++) {
                if(sensorStates[idx2].time < upToTime) {
                    states.push(sensorStates[idx2]);
                } else {
                    break;
                }
            }
            return states;
        } else {
            return state;
        }
    }


    context.getSensorState = function (name) {
        var state = null;

        var sensor = findSensorByName(name);
        if (!context.display || context.autoGrading) {
            var stateTime = context.getSensorExpectedState(name);

            if (stateTime != null) {
                stateTime.hit = true;
                state = stateTime.state;
                if(sensor) {
                    // Redraw from the beginning of this state
                    sensor.lastDrawnTime = Math.min(sensor.lastDrawnTime, stateTime.time);
                }
            }
            else {
                state = 0;
            }
        }

        if (!sensor) {
            context.success = false;
            throw (strings.messages.sensorNotFound.format(name));
        }

        if (state == null) {
            state = sensor.state;
        }
        else {
            sensor.state = state;
            drawSensor(sensor);
        }

        drawNewStateChangesSensor(sensor.name, sensor.state);

        context.increaseTime(sensor);

        return state;
    }

    // This will advance grading time to the next button release for waitForButton
    // will return false if the next event wasn't a button press
    context.advanceToNextRelease = function (sensorType, port) {
        var retval = false;
        var iStates = 0;

        // Advance until current time, ignore everything in the past.
        while (context.gradingStatesByTime[iStates].time <= context.currentTime)
            iStates++;

        for (; iStates < context.gradingStatesByTime.length; iStates++) {
            sensorState = context.gradingStatesByTime[iStates];

            if (sensorState.type == sensorType &&
                sensorState.port == port) {

                sensorState.hit = true;
                if (!sensorState.state) {
                    context.currentTime = sensorState.time;
                    retval = true;
                    break;
                }
            }
            else {
                retval = false;
                break;
            }
        }

        return retval;
    };


    /***** Functions *****/
    /* Here we define each function of the library.
       Blocks will generally use context.group.blockName as their handler
       function, hence we generally use this name for the functions. */
    context.quickpi.turnLedOn = function (callback) {

        context.registerQuickPiEvent("led1", true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        }
        else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("turnLedOn()", cb);
        }
    };

    context.quickpi.turnLedOff = function (callback) {
        context.registerQuickPiEvent("led1", false);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("turnLedOff()", cb);
        }
    };

    context.quickpi.turnBuzzerOn = function (callback) {

        context.registerQuickPiEvent("buzzer1", true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        }
        else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("turnBuzzerOn()", cb);
        }
    };

    context.quickpi.turnBuzzerOff = function (callback) {
        context.registerQuickPiEvent("buzzer1", false);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("turnBuzzerOff()", cb);
        }
    };

    context.quickpi.waitForButton = function (name, callback) {
        //        context.registerQuickPiEvent("button", "D22", "wait", false);
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading) {

            context.advanceToNextRelease("button", sensor.port);

            context.waitDelay(callback);
        } else if (context.offLineMode) {
            if (sensor) {
                var cb = context.runner.waitCallback(callback);
                sensor.onPressed = function () {
                    cb();
                }
            } else {
                context.waitDelay(callback);
            }
        }
        else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("waitForButton(\"" + name + "\")", cb);
        }
    };


    context.quickpi.isButtonPressed = function (arg1, arg2) {
        if(typeof arg2 == "undefined") {
            // no arguments
            var callback = arg1;
            var sensor = findSensorByType("button");
            var name = sensor.name;
        } else {
            var callback = arg2;
            var sensor = findSensorByName(arg1, true);
            var name = arg1;
        }

        if (!context.display || context.autoGrading || context.offLineMode) {

            if (sensor.type == "stick") {
                var state = context.getSensorState(name);
                var stickDefinition = findSensorDefinition(sensor);
                var buttonstate = stickDefinition.getButtonState(name, sensor.state);


                context.runner.noDelay(callback, buttonstate);
            } else {
                var state = context.getSensorState(name);

                context.runner.noDelay(callback, state);
            }
        } else {
            var cb = context.runner.waitCallback(callback);

            if (sensor.type == "stick") {
                var stickDefinition = findSensorDefinition(sensor);

                stickDefinition.getLiveState(sensor, function(returnVal) {
                    sensor.state = returnVal;
                    drawSensor(sensor);

                    var buttonstate = stickDefinition.getButtonState(name, sensor.state);

                    cb(buttonstate);
                });

            } else {
                findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                    sensor.state = returnVal != "0";
                    drawSensor(sensor);
                    cb(returnVal != "0");
                });
            }
        }
    };

    context.quickpi.isButtonPressedWithName = context.quickpi.isButtonPressed;

    context.quickpi.buttonWasPressed = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);
            context.quickPiConnection.sendCommand("buttonWasPressed(\"" + name + "\")", function (returnVal) {
                cb(returnVal != "0");
            });
        }

    };

    context.quickpi.setLedState = function (name, state, callback) {
        var sensor = findSensorByName(name, true);
        var command = "setLedState(\"" + sensor.port + "\"," + (state ? "True" : "False") + ")";

        context.registerQuickPiEvent(name, state ? true : false);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, cb);
        }
    };

    context.quickpi.setBuzzerState = function (name, state, callback) {
        var sensor = findSensorByName(name, true);

        var command = "setBuzzerState(\"" + name + "\"," + (state ? "True" : "False") + ")";

        context.registerQuickPiEvent(name, state ? true : false);

        if(context.display) {
            state ? buzzerSound.start(name) : buzzerSound.stop(name);
        }

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, cb);
        }
    };

    context.quickpi.isBuzzerOn = function (arg1, arg2) {
        if(typeof arg2 == "undefined") {
            // no arguments
            var callback = arg1;
            var sensor = findSensorByType("buzzer");
        } else {
            var callback = arg2;
            var sensor = findSensorByName(arg1, true);
        }

        var command = "isBuzzerOn(\"" + sensor.name + "\")";

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("buzzer1");
            context.waitDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);
            });
        }
    };

    context.quickpi.isBuzzerOnWithName = context.quickpi.isBuzzerOn;

    context.quickpi.setBuzzerNote = function (name, frequency, callback) {
        var sensor = findSensorByName(name, true);
        var command = "setBuzzerNote(\"" + name + "\"," + frequency + ")";

        context.registerQuickPiEvent(name, frequency);

        if(context.display && context.offLineMode) {
            buzzerSound.start(name, frequency);
        }

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);

            });
        }
    };

    context.quickpi.getBuzzerNote = function (name, callback) {
        var sensor = findSensorByName(name, true);

        var command = "getBuzzerNote(\"" + name + "\")";

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback, sensor.state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);

            });
        }
    };


    context.quickpi.setLedBrightness = function (name, level, callback) {
        var sensor = findSensorByName(name, true);

        if (typeof level == "object")
        {
            level = level.valueOf();
        }

        var command = "setLedBrightness(\"" + name + "\"," + level + ")";

        context.registerQuickPiEvent(name, level);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, cb);
        }
    };


    context.quickpi.getLedBrightness = function (name, callback) {
        var sensor = findSensorByName(name, true);

        var command = "getLedBrightness(\"" + name + "\")";

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback, sensor.state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);

            });
        }
    };

    context.quickpi.isLedOn = function (arg1, arg2) {
        if(typeof arg2 == "undefined") {
            // no arguments
            var callback = arg1;
            var sensor = findSensorByType("led");
        } else {
            var callback = arg2;
            var sensor = findSensorByName(arg1, true);
        }

        var command = "getLedState(\"" + sensor.name + "\")";

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback, sensor.state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);

            });
        }
    };

    context.quickpi.isLedOnWithName = context.quickpi.isLedOn;


    context.quickpi.toggleLedState = function (name, callback) {
        var sensor = findSensorByName(name, true);

        var command = "toggleLedState(\"" + name + "\")";
        var state = sensor.state;

        context.registerQuickPiEvent(name, !state);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) { return returnVal != "0"; });
        }
    };

    context.quickpi.displayText = function (line1, arg2, arg3) {
        if(typeof arg3 == "undefined") {
            // Only one argument
            var line2 = null;
            var callback = arg2;
        } else {
            var line2 = arg2;
            var callback = arg3;
        }

        var sensor = findSensorByType("screen");

        var command = "displayText(\"" + line1 + "\", \"\")";

        context.registerQuickPiEvent(sensor.name,
            {
                line1: line1,
                line2: line2
            }
        );

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function (retval) {
                cb();
            });
        }
    };

    context.quickpi.displayText2Lines = context.quickpi.displayText;

    context.quickpi.readTemperature = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);

            context.runner.waitDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };

    context.quickpi.sleep = function (time, callback) {
        context.increaseTimeBy(time);
        if (!context.display || context.autoGrading) {
            context.runner.noDelay(callback);
        }
        else {
            context.runner.waitDelay(callback, null, time);
        }
    };


    context.quickpi.setServoAngle = function (name, angle, callback) {
        var sensor = findSensorByName(name, true);

        if (angle > 180)
            angle = 180;
        else if (angle < 0)
            angle = 0;

        context.registerQuickPiEvent(name, angle);
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var command = "setServoAngle(\"" + name + "\"," + angle + ")";
            cb = context.runner.waitCallback(callback);
            context.quickPiConnection.sendCommand(command, cb);
        }
    };

    context.quickpi.getServoAngle = function (name, callback) {
        var sensor = findSensorByName(name, true);

        var command = "getServoAngle(\"" + name + "\")";

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback, sensor.state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);

            });
        }
    };


    context.quickpi.readRotaryAngle = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {

            var state = context.getSensorState(name);
            context.waitDelay(callback, state);
        } else {

            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };


    context.quickpi.readDistance = function (name, callback) {
        var sensor = findSensorByName(name, true);
        if (!context.display || context.autoGrading || context.offLineMode) {

            var state = context.getSensorState(name);
            context.waitDelay(callback, state);
        } else {

            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };



    context.quickpi.readLightIntensity = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {

            var state = context.getSensorState(name);
            context.waitDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                sensor.state = returnVal;

                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };

    context.quickpi.readHumidity = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {

            var state = context.getSensorState(name);
            context.waitDelay(callback, state);
        } else {

            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };

    context.quickpi.currentTime = function (callback) {
        var millis = new Date().getTime();

        if (context.autoGrading) {
            millis = context.currentTime;
        }

        context.runner.waitDelay(callback, millis);
    };

    context.quickpi.getTemperature = function(location, callback) {
        var retVal =  25;

        context.waitDelay(callback, retVal);
    };

    context.initScreenDrawing = function(sensor) {
        if  (!sensor.screenDrawing)                
            sensor.screenDrawing = new screenDrawing(sensor.canvas);
    }    


    context.quickpi.drawPoint = function(x, y, callback) {
        var sensor = findSensorByType("screen");

        context.initScreenDrawing(sensor);
        sensor.screenDrawing.drawPoint(x, y);
        context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());        

        
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "drawPoint(" + x + "," + y + ")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };

    context.quickpi.drawLine = function(x0, y0, x1, y1, callback) {
        var sensor = findSensorByType("screen");

        context.initScreenDrawing(sensor);
        sensor.screenDrawing.drawLine(x0, y0, x1, y1);
        context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());        

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "drawLine(" + x0 + "," + y0 + "," + x1 + "," + y1 + ")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.drawRectangle = function(x0, y0, width, height, callback) {
        var sensor = findSensorByType("screen");

        context.initScreenDrawing(sensor);
        sensor.screenDrawing.drawRectangle(x0, y0, width, height);
        context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());        


        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "drawRectangle(" + x0 + "," + y0 + "," + width + "," + height + ")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };

    context.quickpi.drawCircle = function(x0, y0, diameter, callback) {

        var sensor = findSensorByType("screen");

        context.initScreenDrawing(sensor);
        sensor.screenDrawing.drawCircle(x0, y0, diameter, diameter);
        context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());        


        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "drawCircle(" + x0 + "," + y0 + "," + diameter + ")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.clearScreen = function(callback) {
        var sensor = findSensorByType("screen");

        context.initScreenDrawing(sensor);
        sensor.screenDrawing.clearScreen();
        context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());        

        
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "clearScreen()";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.updateScreen = function(callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "updateScreen()";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.autoUpdate = function(autoupdate, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "autoUpdate(\"" + (autoupdate ? "True" : "False") + "\")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };

    context.quickpi.fill = function(color, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("screen");
            if (sensor && sensor.canvas)
            {
                var ctx = sensor.canvas.getContext('2d');

                context.noFill = false;
                if (color)
                    ctx.fillStyle = "black";
                else
                    ctx.fillStyle = "white";
            }

            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "fill(\"" + color + "\")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.noFill = function(callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.noFill = true;

            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "NoFill()";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.stroke = function(color, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("screen");
            if (sensor && sensor.canvas)
            {
                var ctx = sensor.canvas.getContext('2d');

                context.noStroke = false;
                if (color)
                    ctx.strokeStyle = "black";
                else
                    ctx.strokeStyle = "white";
            }

            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);
            var command = "stroke(\"" + color + "\")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.noStroke = function(callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.noStroke = true;
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "noStroke()";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.readAcceleration = function(axis, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("accelerometer");

            var index = 0;
            if (axis == "x")
                index = 0;
            else if (axis == "y")
                index = 1;
            else if (axis == "z")
                index = 2;

            var state = context.getSensorState(sensor.name);


            context.waitDelay(callback, state[index]);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "readAcceleration(\"" + axis + "\")";
            context.quickPiConnection.sendCommand(command, function (returnVal) {
                cb(returnVal);
            });
        }
    };

    context.quickpi.computeRotation = function(rotationType, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("accelerometer");

            var zsign = 1;
            var result = 0;

            if (sensor.state[2] < 0)
                zsign = -1;

            if (rotationType == "pitch")
            {
                result = 180 * Math.atan2 (sensor.state[0], zsign * Math.sqrt(sensor.state[1]*sensor.state[1] + sensor.state[2]*sensor.state[2]))/Math.PI;
            }
            else if (rotationType == "roll")
            {
                result = 180 * Math.atan2 (sensor.state[1], zsign * Math.sqrt(sensor.state[0]*sensor.state[0] + sensor.state[2]*sensor.state[2]))/Math.PI;
            }

            result = Math.round(result);

            context.waitDelay(callback, result);
        } else {
            var cb = context.runner.waitCallback(callback);
            var command = "computeRotation(\"" + rotationType + "\")";

            context.quickPiConnection.sendCommand(command, function (returnVal) {
                cb(returnVal);
            });
        }
    };


    context.quickpi.readSoundLevel = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };

    context.quickpi.readMagneticForce = function (axis, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("magnetometer");

            var index = 0;
            if (axis == "x")
                index = 0;
            else if (axis == "y")
                index = 1;
            else if (axis == "z")
                index = 2;

            context.waitDelay(callback, sensor.state[index]);
        } else {
            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("magnetometer", "i2c");

            findSensorDefinition(sensor).getLiveState(axis, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);

                if (axis == "x")
                    returnVal = returnVal[0];
                else if (axis == "y")
                    returnVal = returnVal[1];
                else if (axis == "z")
                    returnVal = returnVal[2];

                cb(returnVal);
            });
        }
    };

    context.quickpi.computeCompassHeading = function (callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("magnetometer");

            var heading = Math.atan2(sensor.state[0],sensor.state[1])*(180/Math.PI) + 180;

            heading = Math.round(heading);

            context.runner.noDelay(callback, heading);
        } else {
            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("magnetometer", "i2c");

            context.quickPiConnection.sendCommand("readMagnetometerLSM303C()", function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);

                returnVal = Math.atan2(sensor.state[0],sensor.state[1])*(180/Math.PI) + 180;

                returnVal = Math.floor(returnVal);

                cb(returnVal);
            }, true);
        }
    };

    context.quickpi.readInfraredState = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };

    context.quickpi.setInfraredState = function (name, state, callback) {
        var sensor = findSensorByName(name, true);

        context.registerQuickPiEvent(name, state ? true : false);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).setLiveState(sensor, state, cb);
        }
    };


    //// Gyroscope
    context.quickpi.readAngularVelocity = function (axis, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("gyroscope");

            var index = 0;
            if (axis == "x")
                index = 0;
            else if (axis == "y")
                index = 1;
            else if (axis == "z")
                index = 2;

            context.waitDelay(callback, sensor.state[index]);
         } else {
            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("gyroscope", "i2c");

            findSensorDefinition(sensor).getLiveState(axis, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);

                if (axis == "x")
                    returnVal = returnVal[0];
                else if (axis == "y")
                    returnVal = returnVal[1];
                else if (axis == "z")
                    returnVal = returnVal[2];

                cb(returnVal);
            });
        }
    };

    context.quickpi.setGyroZeroAngle = function (callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.runner.noDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("setGyroZeroAngle()", function(returnVal) {
                cb();
            }, true);
        }
    };

    context.quickpi.computeRotationGyro = function (axis, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("gyroscope", "i2c");

            context.runner.noDelay(callback, 0);
        } else {
            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("gyroscope", "i2c");

            context.quickPiConnection.sendCommand("computeRotationGyro()", function(returnVal) {
                //sensor.state = returnVal;
                //drawSensor(sensor);

                var returnVal = JSON.parse(returnVal);

                if (axis == "x")
                    returnVal = returnVal[0];
                else if (axis == "y")
                    returnVal = returnVal[1];
                else if (axis == "z")
                    returnVal = returnVal[2];

                cb(returnVal);
            }, true);
        }
    };


    /***** Blocks definitions *****/
    /* Here we define all blocks/functions of the library.
       Structure is as follows:
       {
          group: [{
             name: "someName",
             // category: "categoryName",
             // yieldsValue: optional true: Makes a block with return value rather than simple command
             // params: optional array of parameter types. The value 'null' denotes /any/ type. For specific types, see the Blockly documentation ([1,2])
             // handler: optional handler function. Otherwise the function context.group.blockName will be used
             // blocklyJson: optional Blockly JSON objects
             // blocklyInit: optional function for Blockly.Blocks[name].init
             //   if not defined, it will be defined to call 'this.jsonInit(blocklyJson);
             // blocklyXml: optional Blockly xml string
             // codeGenerators: optional object:
             //   { Python: function that generates Python code
             //     JavaScript: function that generates JS code
             //   }
          }]
       }
       [1] https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks
       [2] https://developers.google.com/blockly/guides/create-custom-blocks/type-checks
    */


    function getSensorNames(sensorType)
    {
        return function () {
            var ports = [];
            for (var i = 0; i < infos.quickPiSensors.length; i++) {
                var sensor = infos.quickPiSensors[i];

                if (sensor.type == sensorType) {
                    ports.push([sensor.name, sensor.name]);
                }
            }

            if (sensorType == "button") {
                for (var i = 0; i < infos.quickPiSensors.length; i++) {
                    var sensor = infos.quickPiSensors[i];

                    if (sensor.type == "stick") {
                        var stickDefinition = findSensorDefinition(sensor);

                        for (var iStick = 0; iStick < stickDefinition.gpiosNames.length; iStick++) {
                            var name = sensor.name + "." + stickDefinition.gpiosNames[iStick];

                            ports.push([name, name]);
                        }
                    }
                }
            }

            if (ports.length == 0) {
                ports.push(["none", "none"]);
            }

            return ports;
        }
    }


    function findSensorByName(name, error=false) {

        if (isNaN(name.substring(0, 1)) && !isNaN(name.substring(1))) {
            for (var i = 0; i < infos.quickPiSensors.length; i++) {
                var sensor = infos.quickPiSensors[i];

                if (sensor.port.toUpperCase() == name.toUpperCase()) {
                    return sensor;
                }
            }
        } else {
            var firstname = name.split(".")[0];


            for (var i = 0; i < infos.quickPiSensors.length; i++) {
                var sensor = infos.quickPiSensors[i];

                if (sensor.name.toUpperCase() == firstname.toUpperCase()) {
                    return sensor;
                }
            }
        }

        if (error) {
            context.success = false;
            throw (strings.messages.sensorNotFound.format(name));
        }

        return null;
    }

    function findSensorByType(type) {
        var firstname = name.split(".")[0];


        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];
            if (sensor.type == type) {
                return sensor;
            }
        }

        return null;
    }

    function findSensorByPort(port) {
        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];
            if (sensor.port == port) {
                return sensor;
            }
        }

        return null;
    }

    function getSensorSuggestedName(type, suggested) {
        if (suggested) {
            if (!findSensorByName(suggested))
                return suggested;
        }

        var i = 0;
        var newName;

        do {
            i++;
            newname = type + i.toString();
        } while (findSensorByName(newName));

        return newName;
    }


    context.customBlocks = {
        // Define our blocks for our namespace "template"
        quickpi: {
            // Categories are reflected in the Blockly menu
            sensors: [
                { name: "currentTime", yieldsValue: true },

                {
                    name: "waitForButton", params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("button")
                            }
                        ]
                    }
                },
                {
                    name: "isButtonPressed", yieldsValue: true
                },
                {
                    name: "isButtonPressedWithName", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("button")
                            },
                        ]
                    }
                },
                {
                    name: "buttonWasPressed", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("button")
                            }
                        ]
                    }
                },
                {
                    name: "readTemperature", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("temperature")
                            }
                        ]
                    }
                },
                {
                    name: "readRotaryAngle", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("potentiometer")
                            }
                        ]
                    }
                },
                {
                    name: "readDistance", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("range")
                            }
                        ]
                    }
                },
                {
                    name: "readLightIntensity", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("light")
                            }
                        ]
                    }
                },
                {
                    name: "readHumidity", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("humidity")
                            }
                        ]
                    }
                },
                {
                    name: "readAcceleration", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": [["x", "x"], ["y", "y"], ["z", "z"] ]
                            }
                        ]
                    }
                },
                {
                    name: "computeRotation", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": [["pitch", "pitch"], ["roll", "roll"]]
                            }
                        ]
                    }
                },
                {
                    name: "readSoundLevel", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("sound")
                            }
                        ]
                    }
                },
                {
                    name: "readMagneticForce", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": [["x", "x"], ["y", "y"], ["z", "z"] ]
                            }
                        ]
                    }
                },
                {
                    name: "computeCompassHeading", yieldsValue: true
                },
                {
                    name: "readInfraredState", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("irrecv")
                            }
                        ]
                    }
                },
                {
                    name: "readAngularVelocity", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": [["x", "x"], ["y", "y"], ["z", "z"] ]
                            }
                        ]
                    }
                },
                {
                    name: "setGyroZeroAngle"
                },
                {
                    name: "computeRotationGyro", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": [["x", "x"], ["y", "y"], ["z", "z"] ]
                            }
                        ]
                    }
                },

            ],
            actions: [
                { name: "turnLedOn" },
                { name: "turnLedOff" },
                { name: "turnBuzzerOn" },
                { name: "turnBuzzerOff" },
                {
                    name: "setLedState", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("led")
                            },
                            { "type": "field_dropdown", "name": "PARAM_1", "options": [["ON", "1"], ["OFF", "0"]] },
                        ]
                    }
                },
                {
                    name: "setBuzzerState", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("buzzer")
                            },
                            { "type": "field_dropdown", "name": "PARAM_1", "options": [["ON", "1"], ["OFF", "0"]] },
                        ]
                    }
                },
                {
                    name: "setBuzzerNote", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("buzzer")
                            },
                            { "type": "input_value", "name": "PARAM_1"},
                        ]
                    },
                    blocklyXml: "<block type='setBuzzerNote'>" +
                        "<value name='PARAM_1'><shadow type='math_number'><field name='NUM'>200</field></shadow></value>" +
                        "</block>"
                },
                {
                    name: "getBuzzerNote", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("buzzer")
                            },
                        ]
                    }
                },
                {
                    name: "setLedBrightness", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("led")
                            },
                            { "type": "input_value", "name": "PARAM_1"},
                        ]
                    },
                    blocklyXml: "<block type='setLedBrightness'>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "getLedBrightness", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("led")
                            },
                        ]
                    }
                },
                {
                    name: "isLedOn", yieldsValue: true
                },
                {
                    name: "isLedOnWithName", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("led")
                            },
                        ]
                    }
                },
                {
                    name: "isBuzzerOn", yieldsValue: true
                },
                {
                    name: "isBuzzerOnWithName", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("buzzer")
                            },
                        ]
                    }
                },
                {
                    name: "toggleLedState", params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("led")
                            },
                        ]
                    }
                },

                {
                    name: "setServoAngle", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("servo")
                            },
                            { "type": "input_value", "name": "PARAM_1" },

                        ]
                    },
                    blocklyXml: "<block type='setServoAngle'>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "getServoAngle", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("servo")
                            },
                        ]
                    }
                },
                {
                    name: "setInfraredState", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {"type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("irtrans")},
                            { "type": "field_dropdown", "name": "PARAM_1", "options": [["ON", "1"], ["OFF", "0"]] },
                        ]
                    }
                },
                {
                    name: "sleep", params: ["Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0", "value": 0 },
                        ]
                    }
                    ,
                    blocklyXml: "<block type='sleep'>" +
                        "<value name='PARAM_0'><shadow type='math_number'><field name='NUM'>1000</field></shadow></value>" +
                        "</block>"
                },
            ],
            display: [
                {
                    name: "displayText", params: ["String", "String"], variants: [[null], [null, null]], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0", "text": "" },
                        ]
                    },
                    blocklyXml: "<block type='displayText'>" +
                        "<value name='PARAM_0'><shadow type='text'><field name='TEXT'>Bonjour</field> </shadow></value>" +
                        "</block>"

                },
                {
                    name: "displayText2Lines", params: ["String", "String"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0", "text": "" },
                            { "type": "input_value", "name": "PARAM_1", "text": "" },
                        ]
                    },
                    blocklyXml: "<block type='displayText2Lines'>" +
                        "<value name='PARAM_0'><shadow type='text'><field name='TEXT'>Bonjour</field> </shadow></value>" +
                        "<value name='PARAM_1'><shadow type='text'><field name='TEXT'></field> </shadow></value>" +
                        "</block>"

                },
                {
                    name: "drawPoint", params: ["Number", "Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                            { "type": "input_value", "name": "PARAM_1"},
                        ]
                    },
                    blocklyXml: "<block type='drawPoint'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "drawLine", params: ["Number", "Number", "Number", "Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                            { "type": "input_value", "name": "PARAM_1"},
                            { "type": "input_value", "name": "PARAM_2"},
                            { "type": "input_value", "name": "PARAM_3"},
                        ]
                    },
                    blocklyXml: "<block type='drawLine'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_2'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_3'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "drawRectangle", params: ["Number", "Number", "Number", "Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                            { "type": "input_value", "name": "PARAM_1"},
                            { "type": "input_value", "name": "PARAM_2"},
                            { "type": "input_value", "name": "PARAM_3"},
                        ]
                    },
                    blocklyXml: "<block type='drawRectangle'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_2'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_3'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "drawCircle", params: ["Number", "Number", "Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                            { "type": "input_value", "name": "PARAM_1"},
                            { "type": "input_value", "name": "PARAM_2"},
                        ]
                    },
                    blocklyXml: "<block type='drawCircle'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_2'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },

                {
                    name: "clearScreen"
                },
                {
                    name: "updateScreen"
                },
                {
                    name: "autoUpdate", params: ["Boolean"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                        ],
                    },
                    blocklyXml: "<block type='autoUpdate'>" +
                    "<value name='PARAM_0'><shadow type='logic_boolean'></shadow></value>" +
                    "</block>"

                },
                {
                    name: "fill", params: ["Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                        ]
                    },
                    blocklyXml: "<block type='fill'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "noFill"
                },
                {
                    name: "stroke", params: ["Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                        ]
                    },
                    blocklyXml: "<block type='stroke'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "noStroke"
                },
            ],
            internet: [
                {
                    name: "getTemperature", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            { "type": "field_input", "name": "PARAM_0", text: "Paris, France"},
                        ]
                    },
                },
            ]
        }
        // We can add multiple namespaces by adding other keys to customBlocks.
    };

    // Color indexes of block categories (as a hue in the range 0–420)
    context.provideBlocklyColours = function () {
        return {
            categories: {
                actions: 0,
                sensors: 100,
                internet: 200,
                display: 300,
            }
        };
    };

    // Constants available in Python
    context.customConstants = {
        quickpi: [
        ]
    };

    // Don't forget to return our newly created context!
    return context;
}

// Register the library; change "template" by the name of your library in lowercase
if (window.quickAlgoLibraries) {
    quickAlgoLibraries.register('quickpi', getContext);
} else {
    if (!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
    window.quickAlgoLibrariesList.push(['quickpi', getContext]);
}

var sensorWithSlider = null;
var removeRect = null;
var sensorWithRemoveRect = null;

window.addEventListener('click', function (e) {
    var keep = false;
    var keepremove = false;
    e = e || window.event;
    var target = e.target || e.srcElement;

    if (sensorWithRemoveRect && sensorWithRemoveRect.focusrect && target == sensorWithRemoveRect.focusrect.node)
        keepremove = true;

    if (removeRect && !keepremove) {
        removeRect.remove();
        removeRect = null;
    }

    if (sensorWithSlider && sensorWithSlider.focusrect && target == sensorWithSlider.focusrect.node)
        keep = true;

    if (sensorWithSlider && sensorWithSlider.sliders) {
        for (var i = 0; i < sensorWithSlider.sliders.length; i++) {
            sensorWithSlider.sliders[i].slider.forEach(function (element) {
                if (target == element.node ||
                    target.parentNode == element.node) {
                    keep = true;
                    return false;
                }
            });
        }
    }

    if (!keep) {
        hideSlider(sensorWithSlider);
    }

}, false);//<-- we'll get to the false in a minute


function hideSlider(sensor) {
    if (!sensor)
        return;

    if (sensor.sliders) {
        for (var i = 0; i < sensor.sliders.length; i++) {
            sensor.sliders[i].slider.remove();
        }
        sensor.sliders = [];
    }


    if (sensor.focusrect && sensor.focusrect.paper && sensor.focusrect.paper.canvas)
        sensor.focusrect.toFront();
};
