/*
    i18n:
        Translations for the various strings in quickAlgo
*/

var localLanguageStrings = {
   fr: {
      categories: {
         actions: "Actions",
         sensors: "Capteurs",
         debug: "Débogage",
         colour: "Couleurs",
         data: "Données",
         dicts: "Dictionnaires",
         input: "Entrées",
         lists: "Listes",
         tables: "Tableaux",
         logic: "Logique",
         loops: "Boucles",
         control: "Contrôles",
         operator: "Opérateurs",
         math: "Maths",
         texts: "Texte",
         variables: "Variables",
         functions: "Fonctions",
         read: "Lecture",
         print: "Écriture"
      },
      invalidContent: "Contenu invalide",
      unknownFileType: "Type de fichier non reconnu",
      download: "télécharger",
      smallestOfTwoNumbers: "Plus petit des deux nombres",
      greatestOfTwoNumbers: "Plus grand des deux nombres",
      flagClicked: "Quand %1 cliqué",
      tooManyIterations: "Votre programme met trop de temps à se terminer !",
      tooManyIterationsWithoutAction: "Votre programme s'est exécuté trop longtemps sans effectuer d'action !",
      submitProgram: "Valider le programme",
      runProgram: "Exécuter sur ce test",
      stopProgram: "|<",
      speedSliderSlower: "Slower",
      speedSliderFaster: "Faster",
      speed: "Vitesse :",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Repartir du début",
      stepProgramDesc: "Exécution pas à pas",
      slowSpeedDesc: "Exécuter sur ce test",
      mediumSpeedDesc: "Vitesse moyenne",
      fastSpeedDesc: "Vitesse rapide",
      ludicrousSpeedDesc: "Vitesse très rapide",
      selectLanguage: "Langage :",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Repartir de blockly",
      loadExample: "Insérer l'exemple",
      saveOrLoadButton: "Charger / enregistrer",
      saveOrLoadProgram: "Enregistrer ou recharger votre programme :",
      avoidReloadingOtherTask: "Attention : ne rechargez pas le programme d'un autre sujet !",
      files: "Fichiers",
      reloadProgram: "Recharger",
      restart: "Recommencer",
      loadBestAnswer: "Charger ma meilleure réponse",
      saveProgram: "Enregistrer",
      limitBlocks: "{remainingBlocks} blocs restants sur {maxBlocks} autorisés.",
      limitBlocksOver: "{remainingBlocks} blocs en trop utilisés pour {maxBlocks} autorisés.",
      limitElements: "{remainingBlocks} blocs restants sur {maxBlocks} autorisés.",
      limitElementsOver: "{remainingBlocks} blocs en trop utilisés pour {maxBlocks} autorisés.",
      capacityWarning: "Attention : votre programme est invalide car il utilise trop de blocs. Faites attention à la limite de blocs affichée en haut à droite de l'éditeur.",
      previousTestcase: "Précédent",
      nextTestcase: "Suivant",
      allTests: "Tous les tests : ",
      errorEmptyProgram: "Le programme est vide ! Connectez des blocs.",
      tooManyBlocks: "Vous utilisez trop de blocs !",
      limitedBlock: "Vous utilisez trop souvent un bloc à utilisation limitée :",
      uninitializedVar: "Variable non initialisée :",
      undefinedMsg: "Cela peut venir d'un accès à un indice hors d'une liste, ou d'une variable non définie.",
      valueTrue: 'vrai',
      valueFalse: 'faux',
      evaluatingAnswer: 'Évaluation en cours',
      correctAnswer: 'Réponse correcte',
      partialAnswer: 'Réponse améliorable',
      wrongAnswer: 'Réponse incorrecte',
      resultsNoSuccess: "Vous n'avez validé aucun test.",
      resultsPartialSuccess: "Vous avez validé seulement {nbSuccess} test(s) sur {nbTests}.",
      gradingInProgress: "Évaluation en cours",
      introTitle: "Votre mission",
      introDetailsTitle: "Détails de la mission",
      textVariable: "texte",
      listVariable: "liste",
      scaleDrawing: "Zoom ×2",
      loopRepeat: "repeat",
      loopDo: "do",
      displayVideo: "Afficher la vidéo",
      showDetails: "Plus de détails",
      hideDetails: "Masquer les détails",
      editor: "Éditeur",
      instructions: "Énoncé",
      testLabel: "Test",
      testError: "erreur",
      testSuccess: "validé",
      seeTest: "voir",
      infiniteLoop: "répéter indéfiniment"
   },
   en: {
      categories: {
         actions: "Actions",
         sensors: "Sensors",
         debug: "Debug",
         colour: "Colors",
         data: "Data",
         dicts: "Dictionaries",
         input: "Input",
         lists: "Lists",
         tables: "Tables",
         logic: "Logic",
         loops: "Loops",
         control: "Controls",
         operator: "Operators",
         math: "Math",
         texts: "Text",
         variables: "Variables",
         functions: "Functions",
         read: "Reading",
         print: "Writing"
      },
      invalidContent: "Invalid content",
      unknownFileType: "Unrecognized file type",
      download: "download",
      smallestOfTwoNumbers: "Smallest of the two numbers",
      greatestOfTwoNumbers: "Greatest of the two numbers",
      flagClicked: "When %1 clicked",
      tooManyIterations: "Too many iterations!",
      tooManyIterationsWithoutAction: "Too many iterations without action!",
      submitProgram: "Validate this program",
      runProgram: "Run this program",
      stopProgram: "|<",
      speedSliderSlower: "Slower",
      speedSliderFaster: "Faster",
      speed: "Speed:",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Restart from the beginning",
      stepProgramDesc: "Step-by-step execution",
      slowSpeedDesc: "Execute on this test",
      mediumSpeedDesc: "Average speed",
      fastSpeedDesc: "Fast speed",
      ludicrousSpeedDesc: "Ludicrous speed",
      selectLanguage: "Language :",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Generate from blockly",
      loadExample: "Insert example",
      saveOrLoadButton: "Load / save",
      saveOrLoadProgram: "Save or reload your code:",
      avoidReloadingOtherTask: "Warning: do not reload code for another task!",
      files: "Files",
      reloadProgram: "Reload",
      restart: "Restart",
      loadBestAnswer: "Load best answer",
      saveProgram: "Save",
      limitBlocks: "{remainingBlocks} blocks remaining out of {maxBlocks} available.",
      limitBlocksOver: "{remainingBlocks} blocks over the limit of {maxBlocks} available.",
      limitElements: "{remainingBlocks} elements remaining out of {maxBlocks} available.",
      limitElementsOver: "{remainingBlocks} elements over the limit of {maxBlocks} available.",
      capacityWarning: "Warning : your program is invalid as it uses too many blocks. Be careful of the block limit displayed on the top right side of the editor.",
      previousTestcase: "Previous",
      nextTestcase: "Next",
      allTests: "All tests: ",
      errorEmptyProgram: "Le programme est vide ! Connectez des blocs.",
      tooManyBlocks: "You use too many blocks!",
      limitedBlock: "You use too many of a limited use block:",
      uninitializedVar: "Uninitialized variable:",
      undefinedMsg: "This can be because of an access to an index out of a list, or an undefined variable.",
      valueTrue: 'true',
      valueFalse: 'false',
      evaluatingAnswer: 'Evaluation in progress',
      correctAnswer: 'Correct answer',
      partialAnswer: 'Partial answer',
      wrongAnswer: 'Wrong answer',
      resultsNoSuccess: "You passed none of the tests.",
      resultsPartialSuccess: "You passed only {nbSuccess} test(s) of {nbTests}.",
      gradingInProgress: "Grading in process",
      introTitle: "Your mission",
      introDetailsTitle: "Mission details",
      textVariable: "text",
      listVariable: "list",
      scaleDrawing: "Scale 2×",
      loopRepeat: "repeat",
      loopDo: "do",
      displayVideo: "Display video",
      showDetails: "Show details",
      hideDetails: "Hide details",
      editor: "Editor",
      instructions: "Instructions",
      testLabel: "Test",
      testError: "error",
      testSuccess: "valid",
      seeTest: "see test"
   },
   de: {
      categories: {
         actions: "Aktionen",
         sensors: "Sensoren",
         debug: "Debug",
         colour: "Farben",
         data: "Daten", // TODO :: translate
         dicts: "Hash-Map",
         input: "Eingabe",
         lists: "Listen",
         tables: "Tables", // TODO :: translate
         logic: "Logik",
         loops: "Schleifen",
         control: "Steuerung",
         operator: "Operatoren",
         math: "Mathe",
         texts: "Text",
         variables: "Variablen",
         functions: "Funktionen",
         read: "Einlesen",
         print: "Ausgeben",
         manipulate: "Umwandeln",
      },
      invalidContent: "Ungültiger Inhalt",
      unknownFileType: "Ungültiger Datentyp",
      download: "Herunterladen",
      smallestOfTwoNumbers: "Kleinere von zwei Zahlen",
      greatestOfTwoNumbers: "Größere von zwei Zahlen",
      flagClicked: "Sobald %1 geklickt", // (scratch start flag, %1 is the flag icon)
      tooManyIterations: "Zu viele Anweisungen wurden ausgeführt!",
      tooManyIterationsWithoutAction: "Zu viele Anweisungen ohne eine Aktion wurden ausgeführt!",
      submitProgram: "Ausführen und bewerten",
      runProgram: "Testen",
      stopProgram: "|<",
      speedSliderSlower: "Slower",
      speedSliderFaster: "Faster",
      speed: "Ablaufgeschwindigkeit:",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Von vorne anfangen", // TODO :: translate and next 5
      stepProgramDesc: "Schritt für Schritt",
      slowSpeedDesc: "Für diesen Test ausführen",
      mediumSpeedDesc: "Mittlere Geschwindigkeit",
      fastSpeedDesc: "Schnell",
      ludicrousSpeedDesc: "Sehr schnell",
      selectLanguage: "Sprache:",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Generiere von Blockly-Blöcken",
      loadExample: "Insert example", // TODO :: translate
      saveOrLoadButton: "Load / save", // TODO :: translate
      saveOrLoadProgram: "Speicher oder lade deinen Quelltext:",
      avoidReloadingOtherTask: "Warnung: Lade keinen Quelltext von einer anderen Aufgabe!",
      files: "Dateien",
      reloadProgram: "Laden",
      restart: "Restart",  // TODO :: translate
      loadBestAnswer: "Load best answer",  // TODO :: translate
      saveProgram: "Speichern",
      limitBlocks: "Noch {remainingBlocks} von {maxBlocks} Bausteinen verfügbar.",
      limitBlocksOver: "{remainingBlocks} Bausteine zusätzlich zum Limit von {maxBlocks} verbraucht.", // TODO :: stimmt das?
      limitElements: "Noch {remainingBlocks} von {maxBlocks} Bausteinen verfügbar.", // TODO :: check this one and next one (same strings as above but with "elements" instead of "blocks"
      limitElementsOver: "{remainingBlocks} Bausteine zusätzlich zum Limit von {maxBlocks} verbraucht.",
      capacityWarning: "Warning : your program is invalid as it uses too many blocks. Be careful of the block limit displayed on the top right side of the editor.",  // TODO :: translate
      previousTestcase: " < ",
      nextTestcase: " > ",
      allTests: "Alle Testfälle: ",
      errorEmptyProgram: "Das Programm enthält keine Befehle. Verbinde die Blöcke um ein Programm zu schreiben.",
      tooManyBlocks: "Du benutzt zu viele Bausteine!",
      limitedBlock: "You use too many of a limited use block:", // TODO
      uninitializedVar: "Nicht initialisierte Variable:",
      undefinedMsg: "This can be because of an access to an index out of a list, or an undefined variable.", // TODO :: translate
      valueTrue: 'wahr',
      valueFalse: 'unwahr',
      evaluatingAnswer: 'Evaluation in progress', // TODO
      correctAnswer: 'Richtige Antwort',
      partialAnswer: 'Teilweise richtige Antwort',
      wrongAnswer: 'Falsche Antwort',
      resultsNoSuccess: "Du hast keinen Testfall richtig.",
      resultsPartialSuccess: "Du hast {nbSuccess} von {nbTests} Testfällen richtig.",
      gradingInProgress: "Das Ergebnis wird ausgewertet …",
      introTitle: "Your mission",  // TODO :: translate
      introDetailsTitle: "Mission details",  // TODO :: translate
      textVariable: "Text",
      listVariable: "Liste",
      scaleDrawing: "Scale 2×",
      loopRepeat: "wiederhole",
      loopDo: "mache",
      displayVideo: "Display video", // TODO :: translate
      showDetails: "Show details", // TODO :: translate
      hideDetails: "Hide details",  // TODO :: translate
      editor: "Editor",  // TODO :: translate
      instructions: "Instructions",  // TODO :: translate
      testLabel: "Test", // TODO :: translate
      testError: "error",  // TODO :: translate
      testSuccess: "valid",  // TODO :: translate
      seeTest: "see test"  // TODO :: translate
   },
   es: {
      categories: {
         actions: "Acciones",
         sensors: "Sensores",
         debug: "Depurar",
         colour: "Colores",
         data: "Datos",
         dicts: "Diccionarios",
         input: "Entradas",
         lists: "Listas",
         tables: "Tablas",
         logic: "Lógica",
         loops: "Bucles",
         control: "Control",
         operator: "Operadores",
         math: "Mate",
         text: "Texto",
         variables: "Variables",
         functions: "Funciones",
         read: "Lectura",
         print: "Escritura"
      },
      invalidContent: "Contenido inválido",
      unknownFileType: "Tipo de archivo no reconocido",
      download: "descargar",
      smallestOfTwoNumbers: "El menor de dos números",
      greatestOfTwoNumbers: "El mayor de dos números",
      flagClicked: "Cuando se hace click en %1",
      tooManyIterations: "¡Su programa se tomó demasiado tiempo para terminar!",
      tooManyIterationsWithoutAction: "¡Su programa se tomó demasiado tiempo para terminar!", // TODO :: change translation
      submitProgram: "Validar el programa",
      runProgram: "Ejecutar el programa",
      speedSliderSlower: "Más lento",
      speedSliderFaster: "Más rápido",
      speed: "Velocidad:",
      stopProgram: "|<",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Reiniciar desde el principio",
      stepProgramDesc: "Ejecución paso a paso",
      slowSpeedDesc: "Ejecutar en esta prueba",
      mediumSpeedDesc: "Velocidad media",
      fastSpeedDesc: "Velocidad rápida",
      ludicrousSpeedDesc: "Velocidad muy rápida",
      selectLanguage: "Lenguaje:",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Generar desde blockly",
      loadExample: "Cargar el ejemplo",
      saveOrLoadButton: "Cargar / Guardar",
      saveOrLoadProgram: "Guardar o cargar su programa:",
      avoidReloadingOtherTask: "Atención: ¡no recargue el programa de otro problema!",
      files: "Archivos",
      reloadProgram: "Recargar",
      restart: "Reiniciar",
      loadBestAnswer: "Cargar la mejor respuesta",
      saveProgram: "Guardar",
      limitBlocks: "{remainingBlocks} bloques disponibles de {maxBlocks} autorizados.",
      limitBlocksOver: "{remainingBlocks} bloques sobre el límite de {maxBlocks} autorizados.",
      limitElements: "{remainingBlocks} elementos disponibles de {maxBlocks} autorizados.",
      limitElementsOver: "{remainingBlocks} elementos sobre el límite de {maxBlocks} autorizados.",
      capacityWarning: "Advertencia: su programa es inválido porque utiliza demasiados bloques. Ponga atención al límite de bloques permitidos mostrados en la parte superior derecha del editor.",
      previousTestcase: "Anterior",
      nextTestcase: "Siguiente",
      allTests: "Todas las pruebas:",
      errorEmptyProgram: "¡El programa está vacío! Conecte algunos bloques.",
      tooManyBlocks: "¡Utiliza demasiados bloques!",
      limitedBlock: "Utiliza demasiadas veces un tipo de bloque limitado:",
      uninitializedVar: "Variable no inicializada:",
      undefinedMsg: "Esto puede ser causado por acceder a un índice fuera de la lista o por una variable no definida.",
      valueTrue: 'verdadero',
      valueFalse: 'falso',
      evaluatingAnswer: 'Evaluación en progreso',
      correctAnswer: 'Respuesta correcta',
      partialAnswer: 'Respuesta parcial',
      wrongAnswer: 'Respuesta Incorrecta',
      resultsNoSuccess: "No pasó ninguna prueba.",
      resultsPartialSuccess: "Pasó únicamente {nbSuccess} prueba(s) de {nbTests}.",
      gradingInProgress: "Evaluación en curso",
      introTitle: "Su misión",
      introDetailsTitle: "Detalles de la misión",
      textVariable: "texto",
      listVariable: "lista",
      scaleDrawing: "Aumentar 2X",
      loopRepeat: "repetir",
      loopDo: "hacer",
      displayVideo: "Mostrar el video",
      showDetails: "Mostrar más información",
      hideDetails: "Ocultar información",
      editor: "Editor",
      instructions: "Enunciado",
      testLabel: "Caso",
      testError: "error",
      testSuccess: "correcto",
      seeTest: "ver"
   },
   sl: {
      categories: {
         actions: "Dejanja",
         sensors: "Senzorji",
         debug: "Razhroščevanje",
         colour: "Barve",
         dicts: "Slovarji",
         input: "Vnos",
         lists: "Tabele",
         tables: "Tables", // TODO :: translate
         logic: "Logika",
         loops: "Zanke",
         control: "Nadzor",
         operator: "Operatorji",
         math: "Matematika",
         texts: "Besedilo",
         variables: "Spremenljivke",
         functions: "Funkcije",
         read: "Branje",
         print: "Pisanje",
         turtle: "Želva"
      },
      invalidContent: "Neveljavna vsebina",
      unknownFileType: "Neznana vrsta datoteke",
      download: "prenos",
      smallestOfTwoNumbers: "Manjše od dveh števil",
      greatestOfTwoNumbers: "Večje od dveh števil",
      flagClicked: "Ko je kliknjena %1",
      tooManyIterations: "Preveč ponovitev!",
      tooManyIterationsWithoutAction: "Preveč ponovitev brez dejanja!",
      submitProgram: "Oddaj program",
      runProgram: "Poženi program",
      stopProgram: "|<",
      speedSliderSlower: "Slower",
      speedSliderFaster: "Faster",
      speed: "Hitrost:",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Začni znova",
      stepProgramDesc: "Izvajanje po korakih",
      slowSpeedDesc: "Počasi",
      mediumSpeedDesc: "Običajno hitro",
      fastSpeedDesc: "Hitro",
      ludicrousSpeedDesc: "Nesmiselno hitro",
      selectLanguage: "Jezik:",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Ustvari iz Blocklyja",
      loadExample: "Insert example", // TODO :: translate
      saveOrLoadButton: "Load / save", // TODO :: translate
      saveOrLoadProgram: "Shrani ali znova naloži kodo:",
      avoidReloadingOtherTask: "Opozorilo: Za drugo nalogo ne naloži kode znova!",
      files: "Files", // TODO :: translate
      reloadProgram: "Znova naloži",
      restart: "Restart",  // TODO :: translate
      loadBestAnswer: "Load best answer",  // TODO :: translate
      saveProgram: "Shrani",
      limitBlocks: "{remainingBlocks} kock izmed {maxBlocks} imaš še na voljo.",
      limitBlocksOver: "{remainingBlocks} kock preko meje {maxBlocks} kock, ki so na voljo.",
      limitElements: "{remainingBlocks} elements remaining out of {maxBlocks} available.", // TODO :: translate
      limitElementsOver: "{remainingBlocks} elements over the limit of {maxBlocks} available.", // TODO :: translate
      capacityWarning: "Warning : your program is invalid as it uses too many blocks. Be careful of the block limit displayed on the top right side of the editor.",  // TODO :: translate
      previousTestcase: "Nazaj",
      nextTestcase: "Naprej",
      allTests: "Vsi testi: ",
      errorEmptyProgram: "Program je prazen! Poveži kocke.",
      tooManyBlocks: "Uporabljaš preveč kock!",
      limitedBlock: "You use too many of a limited use block:", // TODO
      uninitializedVar: "Spremenljivka ni določena:",
      undefinedMsg: "This can be because of an access to an index out of a list, or an undefined variable.", // TODO :: translate
      valueTrue: 'resnično',
      valueFalse: 'neresnično',
      evaluatingAnswer: 'Evaluation in progress', // TODO
      correctAnswer: 'Pravilni odgovor',
      partialAnswer: 'Delni odgovor',
      wrongAnswer: 'Napačen odgovor',
      resultsNoSuccess: "Noben test ni bil opravljen.",
      resultsPartialSuccess: "Opravljen(ih) {nbSuccess} test(ov) od {nbTests}.",
      gradingInProgress: "Ocenjevanje poteka",
      introTitle: "Your mission",  // TODO :: translate
      introDetailsTitle: "Mission details",  // TODO :: translate
      textVariable: "besedilo",
      listVariable: "tabela",
      scaleDrawing: "Zoom ×2", // TODO :: translate
      loopRepeat: "repeat",
      loopDo: "do",
      displayVideo: "Display video",  // TODO :: translate
      showDetails: "Show details", // TODO :: translate
      hideDetails: "Hide details",  // TODO :: translate
      editor: "Editor", // TODO :: translate
      instructions: "Instructions", // TODO :: translate
      testLabel: "Test", // TODO :: translate
      testError: "error",  // TODO :: translate
      testSuccess: "valid",  // TODO :: translate
      seeTest: "see test"  // TODO :: translate
   }
};


window.stringsLanguage = window.stringsLanguage || "fr";
window.languageStrings = window.languageStrings || {};

if (typeof window.languageStrings != "object") {
   console.error("window.languageStrings is not an object");
}
else { // merge translations
   $.extend(true, window.languageStrings, localLanguageStrings[window.stringsLanguage]);
}
