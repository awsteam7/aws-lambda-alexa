/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const questions = require('./questions');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
var answear1 = 0; 
var answear2 = 0; 
var answear3 = 0; 
var answear4 = 0; 

var aws = require('aws-sdk');
var lambda = new aws.Lambda({
  region: 'us-east-2' //change to your region
});

const ANSWER_COUNT = 2;
const GAME_LENGTH = 4;
const SKILL_NAME = 'Reindeer Trivia';
const FALLBACK_MESSAGE = `The ${SKILL_NAME} skill can\'t help you with that.  It can ask you questions about reindeer if you say start game. What can I help you with?`;
const FALLBACK_REPROMPT = 'What can I help you with?';
const APL_DOC = require ('./document/renderPage.json' ) ; 
const TWO_PAGER_COMMANDS =  require ('./document/twoSpeakItemsCommand.json' ) ;
const ONE_PAGER_COMMANDS =  require ('./document/oneSpeakItemCommand.json' ) ;
const TOKEN_ID = 'pagerSample';
const firstTransformerList = [
      {
          "inputPath": "phraseSsml",
          "outputName": "phraseAsSpeech",
          "transformer": "ssmlToSpeech"
      }
    ];
const secondTransformerList = [
      {
          "inputPath": "phraseSsml",
          "outputName": "nextPhraseAsSpeech",
          "transformer": "ssmlToSpeech"
      }
    ];

function makePage(phraseText="",repromptText="",phraseSSMLProperty="",transformerList=[]) {
  return {
    "phraseText" : phraseText ,
    "repromptText":repromptText,
    "properties" :  {
      "phraseSsml" : phraseSSMLProperty
    },
    "transformers": transformerList
  };
}

function supportsDisplay(handlerInput) {
  return handlerInput.requestEnvelope.context
      && handlerInput.requestEnvelope.context.System
      && handlerInput.requestEnvelope.context.System.device
      && handlerInput.requestEnvelope.context.System.device.supportedInterfaces
      && (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']
        || handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display)
      && handlerInput.requestEnvelope.context.Viewport;
}

function populateGameQuestions(translatedQuestions) {
  const gameQuestions = [];
  const indexList = [];
  let index = 4;
  if (GAME_LENGTH > index) {
    throw new Error('Invalid Game Length.');
  }

  for (let i = 0; i < 4; i += 1) {
    indexList.push(i);
  }

  for (let j = 0; j < GAME_LENGTH; j += 1) {
    const rand = j; 
    index -= 1;

    const temp = indexList[index];
    indexList[index] = indexList[rand];
    indexList[rand] = temp;
    gameQuestions.push(indexList[index]);
  }
  return gameQuestions;
}

function populateRoundAnswers(
  gameQuestionIndexes,
  correctAnswerIndex,
  correctAnswerTargetLocation,
  translatedQuestions
) {
  const answers = [];
  const translatedQuestion = translatedQuestions[gameQuestionIndexes[correctAnswerIndex]];
  const answersCopy = translatedQuestion[Object.keys(translatedQuestion)[0]].slice();
  let index = answersCopy.length;

  if (index < ANSWER_COUNT) {
    throw new Error('Not enough answers for question.');
  }

  // Shuffle the answers, excluding the first element which is the correct answer.
  for (let j = 0; j < answersCopy.length; j += 1) {
    const rand = j;
    index -= 1;

    const swapTemp1 = answersCopy[index];
    answersCopy[index] = answersCopy[rand];
    answers[rand] = swapTemp1;
  }


  const swapTemp2 = answers[0];
  answers[0] = answers[correctAnswerTargetLocation];
  answers[correctAnswerTargetLocation] = swapTemp2;
  return ["Yes", "No"];
  
  
}

function isAnswerSlotValid(intent) {
  const answerSlotFilled = intent
    && intent.slots
    && intent.slots.Answer
    && intent.slots.Answer.value;
  const answerSlotIsInt = answerSlotFilled
    && !Number.isNaN(parseInt(intent.slots.Answer.value, 10));
  return answerSlotIsInt
    && parseInt(intent.slots.Answer.value, 10) < (ANSWER_COUNT + 1)
    && parseInt(intent.slots.Answer.value, 10) > 0;
}

async function handleUserGuess(userGaveUp, handlerInput) {
  const { requestEnvelope, attributesManager, responseBuilder } = handlerInput;
  const { intent } = requestEnvelope.request;

  const answerSlotValid = isAnswerSlotValid(intent);

  let speechOutput = '';
  let speechOutputAnalysis = '';
  let aplFirstPageSpeechOutput = '';
  let aplSecondPageSpeechOutput = '';
  const sessionAttributes = attributesManager.getSessionAttributes();
  const gameQuestions = sessionAttributes.questions;
  let correctAnswerIndex = parseInt(sessionAttributes.correctAnswerIndex, 10);
  let currentScore = parseInt(sessionAttributes.score, 10);
  let currentQuestionIndex = parseInt(sessionAttributes.currentQuestionIndex, 10);
  const { correctAnswerText } = sessionAttributes;
  const requestAttributes = attributesManager.getRequestAttributes();
  const translatedQuestions = requestAttributes.t('QUESTIONS');


// start of testing external lambda function 






if (currentQuestionIndex == 0){ 
  answear1 = parseInt(intent.slots.Answer.value, 10)
  
} 
if (currentQuestionIndex == 1){ 
  answear2 = parseInt(intent.slots.Answer.value, 10)
  
} 
if (currentQuestionIndex == 2){ 
  answear3 = parseInt(intent.slots.Answer.value, 10)
  
} 
if (currentQuestionIndex == 3){ 
  answear4 = parseInt(intent.slots.Answer.value, 10)
  
} 


  if (answerSlotValid
    && parseInt(intent.slots.Answer.value, 10) === sessionAttributes.correctAnswerIndex) {
    currentScore += 1;
    speechOutputAnalysis = requestAttributes.t('ANSWER_CORRECT_MESSAGE');
  } else {
    if (!userGaveUp) {
      speechOutputAnalysis = requestAttributes.t('ANSWER_WRONG_MESSAGE');
    }

    speechOutputAnalysis += requestAttributes.t(
      'CORRECT_ANSWER_MESSAGE',
      correctAnswerIndex,
      correctAnswerText
    );
  }

  // Check if we can exit the game session after GAME_LENGTH questions (zero-indexed)
  if (sessionAttributes.currentQuestionIndex === GAME_LENGTH - 1) {
        speechOutput = ""; 
    aplFirstPageSpeechOutput = speechOutput ;
    
     var lastAnswear = parseInt(intent.slots.Answer.value, 10)
     
     var diagnosesMessage = "";
     
     
     
//start of testing external lambda function 

    
var one = 1; 
var two = 1; 
var three = 1; 
var four = 1; 
 
    if(sessionAttributes.question1an == 2){ 
        one = 0 
    }  
    
    if(sessionAttributes.question2an == 2){ 
      two = 0 
      
    }  
    
    if(sessionAttributes.question3an == 2){ 
      
      three = 0 
    } 
    
    if (sessionAttributes.question1an == 1){ 
     
     four = 7  
    }
    
    //start of testing external lambda function 


  let params = {
      FunctionName: 'call_SageMaker_predit_ohio',
      InvocationType: 'RequestResponse',
      Payload: '{ "data" : "' + one + ',' + two + ',' + three + ',' + four + '" }'
     
    };

      await  lambda.invoke(params, function(err, data) {
      if (err) {
        throw err;
      } else {
        console.log('Lambda invoked: ' +  data.Payload);
       
      // diagnosesMessage = data.Payload
       
         if(sessionAttributes.question1an == 2 && sessionAttributes.question2an == 2 && sessionAttributes.question3an == 2){ 
     
       diagnosesMessage = "You're probably fine , no need to see a doctor"
       
     }  else if(data.Payload == "true" || data.Payload == "True") {
        diagnosesMessage = "You should go get diagnosed by a doctor"
       } else if (data.Payload == "false") { 
          diagnosesMessage = "You may be able to to fix your problem by over the counter medication" 
       } 
       
       var obj = JSON.parse(data.Payload) 
    
    //   diagnosesMessage = "not working"
    diagnosesMessage = obj 
   //    diagnosesMessage =  data.Payload
       /*
       
       
        diagnosesMessage = "return something else"
     if(sessionAttributes.question1an == 2 && sessionAttributes.question2an == 2 && sessionAttributes.question3an == 2){ 
     
       diagnosesMessage = "something"
       
     }
     else if(lastAnswear == 1){ 
     diagnosesMessage = "something"
       
     }  else { 
       diagnosesMessage = "something." 
     } 
    */ 
    
      }
    }).promise();


console.log("logging")








//start of testing external lambda function 
     
     
     /*
     if(sessionAttributes.question1an == 2 && sessionAttributes.question2an == 2 && sessionAttributes.question3an == 2){ 
     
       diagnosesMessage = "You're probably fine , no need to see a doctor"
       
     }
     else if(lastAnswear == 1){ 
     diagnosesMessage = "You may need to see a doctor"
       
     }  else { 
       diagnosesMessage = "You may be able to resolve the issue with over the counter medication." 
     } 
    */ 
    aplSecondPageSpeechOutput = requestAttributes.t(
      'GAME_OVER_MESSAGE' + diagnosesMessage
    ); 
  //  speechOutput = userGaveUp ? '' : requestAttributes.t('');

    speechOutput +=  requestAttributes.t(
      'GAME_OVER_MESSAGE'
    ) + diagnosesMessage  ;
    
    if (supportsDisplay(handlerInput)) {
      let payload = {
                "phrase": makePage(aplFirstPageSpeechOutput,"",`<speak>${aplFirstPageSpeechOutput}</speak>`,firstTransformerList),
                "nextPhrase": makePage(aplSecondPageSpeechOutput,"",`<speak>${aplSecondPageSpeechOutput}</speak>`,secondTransformerList)
                };
      speechOutput = "";

      handlerInput.responseBuilder
      .addDirective( 
        {
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.1',
          document : APL_DOC  ,
          datasources : payload,
          token : TOKEN_ID ,
        })
        .addDirective (
          {
            type: 'Alexa.Presentation.APL.ExecuteCommands',
            token : TOKEN_ID ,
            commands :
            [
              TWO_PAGER_COMMANDS
            ]
          });
    }

    return responseBuilder
      .speak(speechOutput)
      .getResponse();
  }
  currentQuestionIndex += 1;
  correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));
  const spokenQuestion = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0];
  const roundAnswers = populateRoundAnswers(
    gameQuestions,
    currentQuestionIndex,
    correctAnswerIndex,
    translatedQuestions
  );
  const questionIndexForSpeech = currentQuestionIndex + 1;
  let repromptText = requestAttributes.t(
    
    spokenQuestion
  );

  for (let i = 0; i < ANSWER_COUNT; i += 1) {
    repromptText += `${i + 1}. ${roundAnswers[i]}. `;
  }
  
  speechOutput += userGaveUp ? '' : requestAttributes.t('ANSWER_IS_MESSAGE');
  aplFirstPageSpeechOutput = speechOutput + speechOutputAnalysis + requestAttributes.t('SCORE_IS_MESSAGE', currentScore.toString());
  aplSecondPageSpeechOutput = repromptText;
  speechOutput += 
     repromptText 
   ;
  

  const translatedQuestion = translatedQuestions[gameQuestions[currentQuestionIndex]];



  Object.assign(sessionAttributes, {
    speechOutput: repromptText,
    repromptText,
    currentQuestionIndex,
    question1an: answear1, 
    question2an: answear2, 
    question3an: answear3, 
    question4an: answear4, 
    correctAnswerIndex: correctAnswerIndex + 1,
    questions: [0, 1, 2, 3],
    score: currentScore,
    correctAnswerText: translatedQuestion[Object.keys(translatedQuestion)[0]][0]
  });

  if (supportsDisplay(handlerInput)) {
    let payload = {
      "phrase": makePage(aplFirstPageSpeechOutput,"",`<speak>${aplFirstPageSpeechOutput}</speak>`,firstTransformerList),
      "nextPhrase": makePage(aplSecondPageSpeechOutput,"",`<speak>${aplSecondPageSpeechOutput}</speak>`,secondTransformerList)};
    speechOutput = "";

    handlerInput.responseBuilder
    .addDirective( 
      {
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.1',
        document : APL_DOC  ,
        datasources : payload ,
        token : TOKEN_ID ,
      })
      .addDirective (
        {
          type: 'Alexa.Presentation.APL.ExecuteCommands',
          token : TOKEN_ID ,
          commands :
          [
            TWO_PAGER_COMMANDS
          ]
        });
  }

  return responseBuilder.speak(speechOutput)
    .reprompt(repromptText)
    .withSimpleCard(requestAttributes.t('GAME_NAME'), repromptText)
    .getResponse();
}

function startGame(newGame, handlerInput) {
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
  let speechOutput = newGame
    ? requestAttributes.t('NEW_GAME_MESSAGE', requestAttributes.t('GAME_NAME'))
      + requestAttributes.t('WELCOME_MESSAGE', GAME_LENGTH.toString())
    : '';
  let aplFirstPageSpeechOutput = speechOutput;
  const translatedQuestions = requestAttributes.t('QUESTIONS');
  const gameQuestions = populateGameQuestions(translatedQuestions);
  const correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));

  const roundAnswers = populateRoundAnswers(
    gameQuestions,
    0,
    correctAnswerIndex,
    translatedQuestions
  );
  const currentQuestionIndex = 0;
  const spokenQuestion = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0];
  let repromptText = requestAttributes.t('TELL_QUESTION_MESSAGE', '1', spokenQuestion);

  for (let i = 0; i < ANSWER_COUNT; i += 1) {
    repromptText += `${i + 1}.  ${roundAnswers[i]}. `;
  }

  speechOutput += repromptText;
  const sessionAttributes = {};

  const translatedQuestion = translatedQuestions[gameQuestions[currentQuestionIndex]];

  Object.assign(sessionAttributes, {
    speechOutput: repromptText,
    repromptText,
    currentQuestionIndex,
    correctAnswerIndex: correctAnswerIndex + 1,
    questions: gameQuestions,
    score: 0,
    correctAnswerText: translatedQuestion[Object.keys(translatedQuestion)[0]][0]
  });

  handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

  if (supportsDisplay(handlerInput)) {
    let payload = {
      "phrase": makePage(aplFirstPageSpeechOutput,"",`<speak>${aplFirstPageSpeechOutput}</speak>`,firstTransformerList),
      "nextPhrase": makePage(repromptText,"",`<speak>${repromptText}</speak>`,secondTransformerList)};
    speechOutput = "";
    handlerInput.responseBuilder
    .addDirective( 
      {
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.1',
        document : APL_DOC  ,
        datasources : payload ,
        token : TOKEN_ID ,
      })
      .addDirective (
        {
          type: 'Alexa.Presentation.APL.ExecuteCommands',
          token : TOKEN_ID ,
          commands :
          [
            TWO_PAGER_COMMANDS
          ]
        });
  }

  return handlerInput.responseBuilder
    .speak(speechOutput)
    .reprompt(repromptText)
    .withSimpleCard(requestAttributes.t('GAME_NAME'), repromptText)
    .getResponse();
}

function helpTheUser(newGame, handlerInput) {
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
  const askMessage = newGame
    ? requestAttributes.t('ASK_MESSAGE_START')
    : requestAttributes.t('REPEAT_QUESTION_MESSAGE') + requestAttributes.t('STOP_MESSAGE');
  let speechOutput = requestAttributes.t('HELP_MESSAGE', GAME_LENGTH) + askMessage;
  const repromptText = requestAttributes.t('HELP_REPROMPT') + askMessage;

  if (supportsDisplay(handlerInput)) {
    let payload = {
        "phrase": makePage(speechOutput,repromptText,`<speak>${speechOutput}</speak>`,firstTransformerList),
        "nextPhrase": makePage("none","<speak></speak>","<speak></speak>",secondTransformerList)
        };
    speechOutput = "";

    handlerInput.responseBuilder
    .addDirective( 
      {
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.1',
        document : APL_DOC  ,
        datasources : payload ,
        token : TOKEN_ID ,
      })
      .addDirective (
        {
          type: 'Alexa.Presentation.APL.ExecuteCommands',
          token : TOKEN_ID ,
          commands :
          [
            ONE_PAGER_COMMANDS
          ]
        });
  }

  return handlerInput.responseBuilder.speak(speechOutput).reprompt(repromptText).getResponse();
}

/* jshint -W101 */
const languageString = {
  en: {
    translation: {
      QUESTIONS: questions.QUESTIONS_EN_US,
      GAME_NAME: 'Health Assistent ',
      HELP_MESSAGE: 'I will ask you %s multiple choice questions. Respond with the number of the answer. For example, say one, two, three, or four. To start a new game at any time, say, start game. ',
      REPEAT_QUESTION_MESSAGE: 'To repeat the last question, say, repeat. ',
      ASK_MESSAGE_START: 'Would you like to start playing?',
      HELP_REPROMPT: 'To give an answer to a question, respond with the number of the answer. ',
      STOP_MESSAGE: 'Would you like to keep playing?',
      QUIT_MESSAGE: 'Good bye.',
      CANCEL_MESSAGE: 'Ok, let\'s play again soon.',
      NO_MESSAGE: 'Ok, we\'ll play another time. Goodbye!',
      TRIVIA_UNHANDLED: 'Try saying a number between 1 and %s',
      HELP_UNHANDLED: 'Say yes to continue, or no to end the game.',
      START_UNHANDLED: 'Say start to start a new game.',
      NEW_GAME_MESSAGE: 'Welcome to %s. ',
      WELCOME_MESSAGE: ' I will try and diagnose your symptoms. ',
      ANSWER_CORRECT_MESSAGE: 'correct. ',
      ANSWER_WRONG_MESSAGE: 'wrong. ',
      CORRECT_ANSWER_MESSAGE: 'The correct answer is %s: %s. ',
      ANSWER_IS_MESSAGE: '',
      TELL_QUESTION_MESSAGE: 'Question %s. %s ',
      GAME_OVER_MESSAGE: "I've reached a diagnoses - ",
      SCORE_IS_MESSAGE: 'Your score is %s. '
    },
  },
  'en-US': {
    translation: {
      QUESTIONS: questions.QUESTIONS_EN_US,
      GAME_NAME: 'Health Diagnoser'
    },
  },
  'en-GB': {
    translation: {
      QUESTIONS: questions.QUESTIONS_EN_GB,
      GAME_NAME: 'British Reindeer Trivia'
    },
  },
  de: {
    translation: {
      QUESTIONS: questions.QUESTIONS_DE_DE,
      GAME_NAME: 'Wissenswertes über Rentiere in Deutsch',
      HELP_MESSAGE: 'Ich stelle dir %s Multiple-Choice-Fragen. Antworte mit der Zahl, die zur richtigen Antwort gehört. Sage beispielsweise eins, zwei, drei oder vier. Du kannst jederzeit ein neues Spiel beginnen, sage einfach „Spiel starten“. ',
      REPEAT_QUESTION_MESSAGE: 'Wenn die letzte Frage wiederholt werden soll, sage „Wiederholen“ ',
      ASK_MESSAGE_START: 'Möchten Sie beginnen?',
      HELP_REPROMPT: 'Wenn du eine Frage beantworten willst, antworte mit der Zahl, die zur richtigen Antwort gehört. ',
      STOP_MESSAGE: 'Möchtest du weiterspielen?',
      QUIT_MESSAGE: 'Auf Wiedersehen.',
      CANCEL_MESSAGE: 'OK, dann lass uns bald mal wieder spielen.',
      NO_MESSAGE: 'OK, spielen wir ein andermal. Auf Wiedersehen!',
      TRIVIA_UNHANDLED: 'Sagt eine Zahl beispielsweise zwischen 1 und %s',
      HELP_UNHANDLED: 'Sage ja, um fortzufahren, oder nein, um das Spiel zu beenden.',
      START_UNHANDLED: 'Du kannst jederzeit ein neues Spiel beginnen, sage einfach „Spiel starten“.',
      NEW_GAME_MESSAGE: 'Willkommen bei %s. ',
      WELCOME_MESSAGE: 'Ich stelle dir %s Fragen und du versuchst, so viele wie möglich richtig zu beantworten. Sage einfach die Zahl, die zur richtigen Antwort passt. Fangen wir an. ',
      ANSWER_CORRECT_MESSAGE: 'Richtig. ',
      ANSWER_WRONG_MESSAGE: 'Falsch. ',
      CORRECT_ANSWER_MESSAGE: 'Die richtige Antwort ist %s: %s. ',
      ANSWER_IS_MESSAGE: 'Diese Antwort ist ',
      TELL_QUESTION_MESSAGE: 'Frage %s. %s ',
      GAME_OVER_MESSAGE: 'Du hast %s von %s richtig beantwortet. Danke fürs Mitspielen!',
      SCORE_IS_MESSAGE: 'Dein Ergebnis ist %s. '
    },
  },
};


const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageString,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    };
  },
};

const LaunchRequest = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.StartOverIntent');
  },
  handle(handlerInput) {
    return startGame(true, handlerInput);
  },
};


const HelpIntent = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const newGame = !(sessionAttributes.questions);
    return helpTheUser(newGame, handlerInput);
  },
};

const FallbackHandler = {

  // 2018-May-01: AMAZON.FallackIntent is only currently available in en-US locale.

  //              This handler will not be triggered except in that locale, so it can be

  //              safely deployed for any locale.

  canHandle(handlerInput) {

    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest'

      && request.intent.name === 'AMAZON.FallbackIntent';

  },

  handle(handlerInput) {

    return handlerInput.responseBuilder

      .speak(FALLBACK_MESSAGE)

      .reprompt(FALLBACK_REPROMPT)

      .getResponse();

  },

};

const UnhandledIntent = {
  canHandle() {
    return true;
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    if (Object.keys(sessionAttributes).length === 0) {
      let speechOutput = requestAttributes.t('START_UNHANDLED');
      let repromptText = speechOutput;
      if (supportsDisplay(handlerInput)) {
        let payload = {
          "phrase": makePage(speechOutput,speechOutput,`<speak>${speechOutput}</speak>`,firstTransformerList),
          "nextPhrase": makePage("none","<speak></speak>","<speak></speak>",secondTransformerList)
          };
        speechOutput = "";

        handlerInput.responseBuilder
        .addDirective( 
          {
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.1',
            document : APL_DOC  ,
            datasources : payload ,
            token : TOKEN_ID ,
          })
          .addDirective (
            {
              type: 'Alexa.Presentation.APL.ExecuteCommands',
              token : TOKEN_ID ,
              commands :
              [
                ONE_PAGER_COMMANDS
              ]
            });
      }
      return handlerInput.attributesManager
        .speak(speechOutput)
        .reprompt(repromptText)
        .getResponse();
    } else if (sessionAttributes.questions) {
      const speechOutput = requestAttributes.t('TRIVIA_UNHANDLED', ANSWER_COUNT.toString());
      const repromptText = speechOutput;
      if (supportsDisplay(handlerInput)) {
        let payload = {
          "phrase": makePage(speechOutput,speechOutput,`<speak>${speechOutput}</speak>`,firstTransformerList),
          "nextPhrase": makePage("none","<speak></speak>","<speak></speak>",secondTransformerList)
          };
        speechOutput = "";

        handlerInput.responseBuilder
        .addDirective( 
          {
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.1',
            document : APL_DOC  ,
            datasources : payload ,
            token : TOKEN_ID ,
          })
          .addDirective (
            {
              type: 'Alexa.Presentation.APL.ExecuteCommands',
              token : TOKEN_ID ,
              commands :
              [
                ONE_PAGER_COMMANDS
              ]
            });
      }
      return handlerInput.responseBuilder
        .speak(speechOutput)
        .reprompt(repromptText)
        .getResponse();
    }
    let speechOutput = requestAttributes.t('HELP_UNHANDLED');
    const repromptText = speechOutput;
    if (supportsDisplay(handlerInput)) {
      let payload = {
        "phrase": makePage(speechOutput,speechOutput,`<speak>${speechOutput}</speak>`,firstTransformerList),
        "nextPhrase": makePage("none","<speak></speak>","<speak></speak>",secondTransformerList)
      };
      speechOutput = "";
      handlerInput.responseBuilder
        .addDirective( 
          {
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.1',
            document : APL_DOC  ,
            datasources : payload ,
            token : TOKEN_ID ,
          })
          .addDirective (
            {
              type: 'Alexa.Presentation.APL.ExecuteCommands',
              token : TOKEN_ID ,
              commands :
              [
                ONE_PAGER_COMMANDS
              ]
            });
    }
    return handlerInput.responseBuilder.speak(speechOutput).reprompt(repromptText).getResponse();
  },
};

const SessionEndedRequest = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const  AnswerIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && (handlerInput.requestEnvelope.request.intent.name === 'AnswerIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'DontKnowIntent');
  },
  async handle(handlerInput) {
    if (handlerInput.requestEnvelope.request.intent.name === 'AnswerIntent') {
      return await  handleUserGuess(false, handlerInput);
    }
    return await handleUserGuess(true, handlerInput);
  },
};

const RepeatIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent';
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let speechOutput = sessionAttributes.speechOutput;
    let repromptText = sessionAttributes.repromptText;
    if (supportsDisplay(handlerInput)) {
        let payload = {
          "phrase": makePage(speechOutput,repromptText,`<speak>${speechOutput}</speak>`,firstTransformerList),
          "nextPhrase": makePage("none","<speak></speak>","<speak></speak>",secondTransformerList)
        };
        speechOutput = "";

      handlerInput.responseBuilder
        .addDirective( 
          {
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.1',
            document : APL_DOC  ,
            datasources : payload ,
            token : TOKEN_ID ,
          })
          .addDirective (
            {
              type: 'Alexa.Presentation.APL.ExecuteCommands',
              token : TOKEN_ID ,
              commands :
              [
                ONE_PAGER_COMMANDS
              ]
            });
    }
    
    return handlerInput.responseBuilder.speak(speechOutput)
      .reprompt(repromptText)
      .getResponse();
  },
};

const YesIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let speechOutput = sessionAttributes.speechOutput;
    let repromptText = sessionAttributes.repromptText;
    if (sessionAttributes.questions) {
      if (supportsDisplay(handlerInput)) {
        let payload = {
          "phrase": makePage(speechOutput,repromptText,`<speak>${speechOutput}</speak>`,firstTransformerList),
          "nextPhrase": makePage("none","<speak></speak>","<speak></speak>",secondTransformerList)
        };
        speechOutput = "";

        handlerInput.responseBuilder
        .addDirective( 
          {
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.1',
            document : APL_DOC  ,
            datasources : payload ,
            token : TOKEN_ID ,
          })
          .addDirective (
            {
              type: 'Alexa.Presentation.APL.ExecuteCommands',
              token : TOKEN_ID ,
              commands :
              [
                ONE_PAGER_COMMANDS
              ]
            });
      }
      
      return handlerInput.responseBuilder.speak(speechOutput)
        .reprompt(repromptText)
        .getResponse();
    }
    return startGame(false, handlerInput);
  },
};


const StopIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    let speechOutput = requestAttributes.t('QUIT_MESSAGE');
    if (supportsDisplay(handlerInput)) {
      let payload = {
        "phrase": makePage(speechOutput,speechOutput,`<speak>${speechOutput}</speak>`,firstTransformerList),
        "nextPhrase": makePage("none","<speak></speak>","<speak></speak>",secondTransformerList)
        };
      speechOutput = "";

      handlerInput.responseBuilder
      .addDirective( 
        {
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.1',
          document : APL_DOC  ,
          datasources : payload ,
          token : TOKEN_ID ,
        })
        .addDirective (
          {
            type: 'Alexa.Presentation.APL.ExecuteCommands',
            token : TOKEN_ID ,
            commands :
            [
              ONE_PAGER_COMMANDS
            ]
          });
    }
    return handlerInput.responseBuilder.speak(speechOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const CancelIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    let speechOutput = requestAttributes.t('CANCEL_MESSAGE');
    if (supportsDisplay(handlerInput)) {
      let payload = {
        "phrase": makePage(speechOutput,speechOutput,`<speak>${speechOutput}</speak>`,firstTransformerList),
        "nextPhrase": makePage("none","<speak></speak>","<speak></speak>",secondTransformerList)
        };
      speechOutput = "";
      handlerInput.responseBuilder
      .addDirective( 
        {
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.1',
          document : APL_DOC  ,
          datasources : payload ,
          token : TOKEN_ID ,
        })
        .addDirective (
          {
            type: 'Alexa.Presentation.APL.ExecuteCommands',
            token : TOKEN_ID ,
            commands :
            [
              ONE_PAGER_COMMANDS
            ]
          }); 
    }
    return handlerInput.responseBuilder.speak(speechOutput)
      .getResponse();
  },
};

const NoIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    let speechOutput = requestAttributes.t('NO_MESSAGE');
    if (supportsDisplay(handlerInput)) {
      let payload = {
        "phrase": makePage(speechOutput,"",`<speak>${speechOutput}</speak>`,firstTransformerList),
        "nextPhrase": makePage("none","<speak></speak>","<speak></speak>",secondTransformerList)
        };
      speechOutput = "";
      handlerInput.responseBuilder
      .addDirective( 
        {
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.1',
          document : APL_DOC  ,
          datasources : payload ,
          token : TOKEN_ID ,
        })
        .addDirective (
          {
            type: 'Alexa.Presentation.APL.ExecuteCommands',
            token : TOKEN_ID ,
            commands :
            [
              ONE_PAGER_COMMANDS
            ]
          });
    }
    return handlerInput.responseBuilder.speak(speechOutput).getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    let speechOutput = 'Sorry, I can\'t understand the command. Please say again.';
    const repromptText = speechOutput;
    if (supportsDisplay(handlerInput)) {
      let payload = {
        "phrase": makePage(speechOutput,speechOutput,`<speak>${speechOutput}</speak>`,firstTransformerList),
        "nextPhrase": makePage("none","<speak></speak>","<speak></speak>",secondTransformerList)
        };
      speechOutput = "";
      handlerInput.responseBuilder
      .addDirective( 
        {
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.1',
          document : APL_DOC  ,
          datasources : payload ,
          token : TOKEN_ID ,
        })
        .addDirective (
          {
            type: 'Alexa.Presentation.APL.ExecuteCommands',
            token : TOKEN_ID ,
            commands :
            [
              TWO_PAGER_COMMANDS
            ]
          });
    }
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(repromptText)
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequest,
    HelpIntent,
    AnswerIntent,
    RepeatIntent,
    YesIntent,
    StopIntent,
    CancelIntent,
    NoIntent,
    SessionEndedRequest,
    FallbackHandler,
    UnhandledIntent
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();

