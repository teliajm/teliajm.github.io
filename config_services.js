/*************************************************************
 * CONFIGURATION OF ACE Web SDK
 *
 * For more information, see
 * Telia ACE Configuration Instruction ACE Web SDK
 *************************************************************/

CallGuide.config.services = {
  /* ***************************************
   * GENERAL
   *************************************** */

  ACEWebSDK: {
    features: {
      // The features section can be used to turn on or off specific features in Web SDK.

      // Enable ACE Chat API (to load chat client, see loadACEChatClient setting below)
      enableChat: true,

      // Enable ACE Proactive Web
      enableProactiveWeb: false,

      // Enable ACE Cobrowsing
      enableCobrowsing: false,

      // Load ACE Online One Widget (v5) and ACE Plugins for ACE Knowledge
      // ACE Online Widgets v5 is One Widget
      loadACEKnowledge_v5: true,

      // JavaScript API for ACE Web API (client version) related functions
      enableWebApi: true,

      // Load ACE Reference Chat Client files 'ACEChat.min.js', 'ACEChat.min.js'
      // and chat config file (defined in conf.chat.conf.aceChatClientConfig)
      loadACEChatClient: false,

      // If true, Web SDK will send insights for enabled methods in
      // ACEWebSDK.conf.insights section of this file.
      enableInsights: false,
    },

    conf: {
      // /////////////////
      // LANGUAGE SECTION
      // /////////////////

      languages: {
        nb: '1',
        en: '1',
        fi: '1',
        sv: '1',
        da: '1',
      },
      defaultLanguage: 'sv',

      // langDetect can be reached on either Chat Engine,
      // Proactive Web Engine, or COB Server.
      langDetectUrl: 'https://chat.ace.teliacompany.net/29/langDetect',

      // ///////////////////
      // ASSOCIATED DOMAINS
      // ///////////////////

      singleDomain: false,

      // One instance of ACE Web SDK can be loaded on more than one domain,
      // and cobrowsing and chat follows seamlessly across the involved domains.
      // However, the involved domains (or origins) must be declared here.
      // Further, CORS allowed origins for the subproducts chat, proactive web, and cobrowsing
      // must be configured for EACH corresponding engine.
      // From ACE 13, the list of allowed origins for Chat Engines can be set in ACE Admin,
      // per Chat Engine and Organisation Area.
      // From ACE 15, ACE Web SDK has its onw list, configured in ACE Admin. This list is applied
      // to the CORS control in ACE Web API, but can also be fetched by ACE Web SDK.
      // ACE Web SDK uses the list of origins to decide if the session ids can be fetched or not.
      //
      // Example declaring a domain list (and and a white list of origins for session ids) in the
      // present file:
      // domains: ['cust.domain.ex', 'www.domain.ex', 'wds.domain.ex'],

      // Example fetching the list of origins from a URL:
      // allowedOrigins: 'https://www.callguide.com/wda/getConfiguration',

      // As if this amount of options was not enough, you can also configure allowedOrigins as an
      // array of white-listed origins. Example:
      // allowedOrigins: ['https://b2b.acme.com', 'https://consumer.acme.com'],

      // If both allowedOrigins and domains are declared, the visitor clients will use the
      // allowedOrigins, and the domains parameter is required only for agent cobrowsing client.
      // Thus, if allowedOrigins are used and if no cobrwosing is configured, the domains parameter
      // can be deleted.

      domains: [
        "wds.callguide.telia.com",
        "wds.ace.teliacompany.com",
        "localhost",
        "jespertest.humany.net",
        "ace-telecom.humany.net",
        "demobolaget.humany.cc"
      ],

      insights: {
        // If true, ACE Web SDK will dispatch custom events ('ace.websdk.insights') within the
        // current window, for each insight event. Applications can subscribe to these by
        // registering corresponding event listeners.
        enableCustomEvents: false,

      },

      // ///////////////////
      // AUTHENTICATION TOKEN
      // ///////////////////

      // ACE Web SDK can fetch a token, for authentication in chat sessions.
      // Two options can be configured here:
      // - From web storage (has predecence if both are configured)
      // - From an URL (format: https://idp.domain.ex/auth/jwt.json)
      // Note: There are also possibilities to add the token using api functions.
										   
      authToken: {
        fromWebStorage: {
          storage: '', // 'local', 'session', or empty to disable!
          key: 'authToken',
        },
        fromUrl: {
          url: '', // Empty to disable!
          responseType: 'json',
          tokenProperty: 'jwt',
        },
      },

      aceWebApi: {
        // For Single-tenant ACE System:
        // URL format: https://{clusterwarehost}/webapi/client/{companyName}
        // Example: baseUrl: 'https://cgedgestage.labbn.se/webapi/client/devtrack1',
        //
        // For Multi-tenant ACE System (companyName appended automatically):
        // URL format: https://{clusterwarehost}/webapi/client
        // Example: baseUrl: 'https://cgedgestage.labbn.se/webapi/client',

		baseUrl: 'https://api.ace.teliacompany.net/webapi/client/folksam',
        timeout: 3000, // milliseconds
      },

      // Array of configurations, one for each ACE Knowledge Implementation.
      aceKnowledge: [        
        {
          // If object has a companyName property, it is loaded only when companyNames match.
          // Otherwise the implementation is always loaded.

          // The URL to the Humany implementation and the version must be provided.
          // Note: Only version 4 and 5 implementations are supported.
           humanyUrl: 'https://folksam.humany.net/ny-folksam-med-ace-kontaktvagar-v5',
          version: 'v5',
          suppressContactCentreStatus: false,
          callback: {
            maxAvailableDates: 14,
            minuteInterval: 10,
          },
          chat: {
            enableConversationHistoryTransfer: true,
            enableWritingWhileInQueue: true,
            playChatNoticeSound: false,
          },
          pluginTexts: {
            phone: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            email: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad svarstid är {{eqt}}.', // {{position}} {{agents}}
                weWillEmailYou: 'Tack för ditt mail!', // {{mail}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            callback: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                weWillCallYou: 'Tack! Vi ringer dig på {{phoneNumber}}.',
                nonNumericPhoneNumber: 'Telefonnumret kan endast innehålla siffror.', // {{phoneNumber}}
                nonCanonicalPhoneNumber: 'Ange telefonnumret på formatet +46 70 234 56 78.', // {{phoneNumber}}
                phoneNumberAlreadyBooked:
                  'Det finns redan en begäran om uppringning till {{phoneNumber}}.',
                somethingWentWrong: 'Något gick fel. Försökt igen senare.',
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatContactMethod: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                chatCannotStart: 'Det går inte att starta en chatt här och nu.',
                chatStarted: 'Chatten har startat.',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatConversation: {
              sv: {
                chatStarting: 'Chatten startas...',
                chatHeader: 'Chatt',
                chatHeaderClosed: 'Chatten är avslutad',
                quitTooltip: 'Avsluta chatten',
                emailSent: 'E-post är skickad till dig.',
                emailError: 'Det gick inte att skicka e-post till dig.',
                errorMessage: 'Något blev fel',
                inputPlaceholder: 'Skriv ditt meddelande här...',
                emailPrompt: 'Du kan få chatten skickad till dig.',
                emailLabel: 'Din e-postadress',
                emailPlaceholder: 'e-postadress...',
                emailSkip: 'Nej tack',
                emailSubmit: 'Skicka',
                quitChat: 'Avsluta chatten',
                quitChatConfirm: 'Är du säker på att du vill avsluta chatten?',
                quitChatYes: 'Ja',
                quitChatNo: 'Nej',
                videoHeader: 'Videosamtal',
                videoAccept: 'Acceptera',
                videoDecline: 'Neka',
                videoWasAccepted: 'Videosamtal accepterades',
                videoWasDeclined: 'Videosamtal nekades',
                videoLoadingMessage: 'Laddar video…',
                videoHelpText:
                  'Om videon inte startar, tryck på knappen nedan för att byta till text',
                videoShowTextChat: 'Visa textchatten',
                chatDisconnected:
                  'Anslutningsproblem. Meddelanden kan bli försenade. Försöker återansluta ...',
                chatReconnected: 'Anslutning återställd.',
              },
            },
          },
        },
		
        {
          // If object has a companyName property, it is loaded only when companyNames match.
          // Otherwise the implementation is always loaded.

          // The URL to the Humany implementation and the version must be provided.
          // Note: Only version 4 and 5 implementations are supported.
           humanyUrl: 'https://folksam.humany.net/ny-folksam-med-ace-kontaktvagar-v5-90',
          version: 'v5',
          suppressContactCentreStatus: false,
          callback: {
            maxAvailableDates: 14,
            minuteInterval: 10,
          },
          chat: {
            enableConversationHistoryTransfer: true,
            enableWritingWhileInQueue: true,
            playChatNoticeSound: false,
          },
          pluginTexts: {
            phone: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            email: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad svarstid är {{eqt}}.', // {{position}} {{agents}}
                weWillEmailYou: 'Tack för ditt mail!', // {{mail}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            callback: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                weWillCallYou: 'Tack! Vi ringer dig på {{phoneNumber}}.',
                nonNumericPhoneNumber: 'Telefonnumret kan endast innehålla siffror.', // {{phoneNumber}}
                nonCanonicalPhoneNumber: 'Ange telefonnumret på formatet +46 70 234 56 78.', // {{phoneNumber}}
                phoneNumberAlreadyBooked:
                  'Det finns redan en begäran om uppringning till {{phoneNumber}}.',
                somethingWentWrong: 'Något gick fel. Försökt igen senare.',
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
              pl: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                weWillCallYou: 'Dzięki! Zadzwonimy do Ciebie {{phoneNumber}}.',
                nonNumericPhoneNumber: 'Numer telefonu może zawierać tylko cyfry.', // {{phoneNumber}}
                nonCanonicalPhoneNumber: 'Wprowadź numer telefonu w formacie +46 70 234 56 78.', // {{phoneNumber}}
                phoneNumberAlreadyBooked:
                  'Istnieje już prośba o połączenie do {{phoneNumber}}.',
                somethingWentWrong: 'Coś poszło nie tak. Spróbowałem ponownie później',
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatContactMethod: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                chatCannotStart: 'Det går inte att starta en chatt här och nu.',
                chatStarted: 'Chatten har startat.',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatConversation: {
              sv: {
                chatStarting: 'Chatten startas...',
                chatHeader: 'Chatt',
                chatHeaderClosed: 'Chatten är avslutad',
                quitTooltip: 'Avsluta chatten',
                emailSent: 'E-post är skickad till dig.',
                emailError: 'Det gick inte att skicka e-post till dig.',
                errorMessage: 'Något blev fel',
                inputPlaceholder: 'Skriv ditt meddelande här...',
                emailPrompt: 'Du kan få chatten skickad till dig.',
                emailLabel: 'Din e-postadress',
                emailPlaceholder: 'e-postadress...',
                emailSkip: 'Nej tack',
                emailSubmit: 'Skicka',
                quitChat: 'Avsluta chatten',
                quitChatConfirm: 'Är du säker på att du vill avsluta chatten?',
                quitChatYes: 'Ja',
                quitChatNo: 'Nej',
                videoHeader: 'Videosamtal',
                videoAccept: 'Acceptera',
                videoDecline: 'Neka',
                videoWasAccepted: 'Videosamtal accepterades',
                videoWasDeclined: 'Videosamtal nekades',
                videoLoadingMessage: 'Laddar video…',
                videoHelpText:
                  'Om videon inte startar, tryck på knappen nedan för att byta till text',
                videoShowTextChat: 'Visa textchatten',
                chatDisconnected:
                  'Anslutningsproblem. Meddelanden kan bli försenade. Försöker återansluta ...',
                chatReconnected: 'Anslutning återställd.',
              },
            },
          },
        },
		
        {
          // If object has a companyName property, it is loaded only when companyNames match.
          // Otherwise the implementation is always loaded.

          // The URL to the Humany implementation and the version must be provided.
          // Note: Only version 4 and 5 implementations are supported.
          humanyUrl: 'https://folksam.humany.net/ny-folksam-med-ace-kontaktvagar-v5-70',
          version: 'v5',
          suppressContactCentreStatus: false,
          callback: {
            maxAvailableDates: 14,
            minuteInterval: 10,
          },
          chat: {
            enableConversationHistoryTransfer: true,
            enableWritingWhileInQueue: true,
            playChatNoticeSound: false,
          },
          pluginTexts: {
            phone: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            email: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad svarstid är {{eqt}}.', // {{position}} {{agents}}
                weWillEmailYou: 'Tack för ditt mail!', // {{mail}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            callback: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                weWillCallYou: 'Tack! Vi ringer dig på {{phoneNumber}}.',
                nonNumericPhoneNumber: 'Telefonnumret kan endast innehålla siffror.', // {{phoneNumber}}
                nonCanonicalPhoneNumber: 'Ange telefonnumret på formatet +46 70 234 56 78.', // {{phoneNumber}}
                phoneNumberAlreadyBooked:
                  'Det finns redan en begäran om uppringning till {{phoneNumber}}.',
                somethingWentWrong: 'Något gick fel. Försökt igen senare.',
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatContactMethod: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                chatCannotStart: 'Det går inte att starta en chatt här och nu.',
                chatStarted: 'Chatten har startat.',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatConversation: {
              sv: {
                chatStarting: 'Chatten startas...',
                chatHeader: 'Chatt',
                chatHeaderClosed: 'Chatten är avslutad',
                quitTooltip: 'Avsluta chatten',
                emailSent: 'E-post är skickad till dig.',
                emailError: 'Det gick inte att skicka e-post till dig.',
                errorMessage: 'Något blev fel',
                inputPlaceholder: 'Skriv ditt meddelande här...',
                emailPrompt: 'Du kan få chatten skickad till dig.',
                emailLabel: 'Din e-postadress',
                emailPlaceholder: 'e-postadress...',
                emailSkip: 'Nej tack',
                emailSubmit: 'Skicka',
                quitChat: 'Avsluta chatten',
                quitChatConfirm: 'Är du säker på att du vill avsluta chatten?',
                quitChatYes: 'Ja',
                quitChatNo: 'Nej',
                videoHeader: 'Videosamtal',
                videoAccept: 'Acceptera',
                videoDecline: 'Neka',
                videoWasAccepted: 'Videosamtal accepterades',
                videoWasDeclined: 'Videosamtal nekades',
                videoLoadingMessage: 'Laddar video…',
                videoHelpText:
                  'Om videon inte startar, tryck på knappen nedan för att byta till text',
                videoShowTextChat: 'Visa textchatten',
                chatDisconnected:
                  'Anslutningsproblem. Meddelanden kan bli försenade. Försöker återansluta ...',
                chatReconnected: 'Anslutning återställd.',
              },
            },
          },
        },
        {
          // If object has a companyName property, it is loaded only when companyNames match.
          // Otherwise the implementation is always loaded.

          // The URL to the Humany implementation and the version must be provided.
          // Note: Only version 4 and 5 implementations are supported.
           humanyUrl: 'https://folksam.humany.net/fackforbundimpl',
          version: 'v5',
          suppressContactCentreStatus: false,
          callback: {
            maxAvailableDates: 14,
            minuteInterval: 10,
          },
          chat: {
            enableConversationHistoryTransfer: true,
            enableWritingWhileInQueue: true,
            playChatNoticeSound: false,
          },
          pluginTexts: {
            phone: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            email: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad svarstid är {{eqt}}.', // {{position}} {{agents}}
                weWillEmailYou: 'Tack för ditt mail!', // {{mail}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            callback: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                weWillCallYou: 'Tack! Vi ringer dig på {{phoneNumber}}.',
                nonNumericPhoneNumber: 'Telefonnumret kan endast innehålla siffror.', // {{phoneNumber}}
                nonCanonicalPhoneNumber: 'Ange telefonnumret på formatet +46 70 234 56 78.', // {{phoneNumber}}
                phoneNumberAlreadyBooked:
                  'Det finns redan en begäran om uppringning till {{phoneNumber}}.',
                somethingWentWrong: 'Något gick fel. Försökt igen senare.',
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatContactMethod: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                chatCannotStart: 'Det går inte att starta en chatt här och nu.',
                chatStarted: 'Chatten har startat.',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatConversation: {
              sv: {
                chatStarting: 'Chatten startas...',
                chatHeader: 'Chatt',
                chatHeaderClosed: 'Chatten är avslutad',
                quitTooltip: 'Avsluta chatten',
                emailSent: 'E-post är skickad till dig.',
                emailError: 'Det gick inte att skicka e-post till dig.',
                errorMessage: 'Något blev fel',
                inputPlaceholder: 'Skriv ditt meddelande här...',
                emailPrompt: 'Du kan få chatten skickad till dig.',
                emailLabel: 'Din e-postadress',
                emailPlaceholder: 'e-postadress...',
                emailSkip: 'Nej tack',
                emailSubmit: 'Skicka',
                quitChat: 'Avsluta chatten',
                quitChatConfirm: 'Är du säker på att du vill avsluta chatten?',
                quitChatYes: 'Ja',
                quitChatNo: 'Nej',
                videoHeader: 'Videosamtal',
                videoAccept: 'Acceptera',
                videoDecline: 'Neka',
                videoWasAccepted: 'Videosamtal accepterades',
                videoWasDeclined: 'Videosamtal nekades',
                videoLoadingMessage: 'Laddar video…',
                videoHelpText:
                  'Om videon inte startar, tryck på knappen nedan för att byta till text',
                videoShowTextChat: 'Visa textchatten',
                chatDisconnected:
                  'Anslutningsproblem. Meddelanden kan bli försenade. Försöker återansluta ...',
                chatReconnected: 'Anslutning återställd.',
              },
            },
          },
        },
        {
          // If object has a companyName property, it is loaded only when companyNames match.
          // Otherwise the implementation is always loaded.

          // The URL to the Humany implementation and the version must be provided.
          // Note: Only version 4 and 5 implementations are supported.
           humanyUrl: 'https://folksam.humany.net/kpa-v5',
          version: 'v5',
          suppressContactCentreStatus: false,
          callback: {
            maxAvailableDates: 14,
            minuteInterval: 10,
          },
          chat: {
            enableConversationHistoryTransfer: true,
            enableWritingWhileInQueue: true,
            playChatNoticeSound: false,
          },
          pluginTexts: {
            phone: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            email: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad svarstid är {{eqt}}.', // {{position}} {{agents}}
                weWillEmailYou: 'Tack för ditt mail!', // {{mail}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            callback: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                weWillCallYou: 'Tack! Vi ringer dig på {{phoneNumber}}.',
                nonNumericPhoneNumber: 'Telefonnumret kan endast innehålla siffror.', // {{phoneNumber}}
                nonCanonicalPhoneNumber: 'Ange telefonnumret på formatet +46 70 234 56 78.', // {{phoneNumber}}
                phoneNumberAlreadyBooked:
                  'Det finns redan en begäran om uppringning till {{phoneNumber}}.',
                somethingWentWrong: 'Något gick fel. Försökt igen senare.',
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatContactMethod: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                chatCannotStart: 'Det går inte att starta en chatt här och nu.',
                chatStarted: 'Chatten har startat.',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatConversation: {
              sv: {
                chatStarting: 'Chatten startas...',
                chatHeader: 'Chatt',
                chatHeaderClosed: 'Chatten är avslutad',
                quitTooltip: 'Avsluta chatten',
                emailSent: 'E-post är skickad till dig.',
                emailError: 'Det gick inte att skicka e-post till dig.',
                errorMessage: 'Något blev fel',
                inputPlaceholder: 'Skriv ditt meddelande här...',
                emailPrompt: 'Du kan få chatten skickad till dig.',
                emailLabel: 'Din e-postadress',
                emailPlaceholder: 'e-postadress...',
                emailSkip: 'Nej tack',
                emailSubmit: 'Skicka',
                quitChat: 'Avsluta chatten',
                quitChatConfirm: 'Är du säker på att du vill avsluta chatten?',
                quitChatYes: 'Ja',
                quitChatNo: 'Nej',
                videoHeader: 'Videosamtal',
                videoAccept: 'Acceptera',
                videoDecline: 'Neka',
                videoWasAccepted: 'Videosamtal accepterades',
                videoWasDeclined: 'Videosamtal nekades',
                videoLoadingMessage: 'Laddar video…',
                videoHelpText:
                  'Om videon inte startar, tryck på knappen nedan för att byta till text',
                videoShowTextChat: 'Visa textchatten',
                chatDisconnected:
                  'Anslutningsproblem. Meddelanden kan bli försenade. Försöker återansluta ...',
                chatReconnected: 'Anslutning återställd.',
              },
            },
          },
        },
        {
          // If object has a companyName property, it is loaded only when companyNames match.
          // Otherwise the implementation is always loaded.

          // The URL to the Humany implementation and the version must be provided.
          // Note: Only version 4 and 5 implementations are supported.
           humanyUrl: 'https://folksam.humany.net/folksam-kundservice-inline',
          version: 'v5',
          suppressContactCentreStatus: false,
          callback: {
            maxAvailableDates: 14,
            minuteInterval: 10,
          },
          chat: {
            enableConversationHistoryTransfer: true,
            enableWritingWhileInQueue: true,
            playChatNoticeSound: false,
          },
          pluginTexts: {
            phone: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            email: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad svarstid är {{eqt}}.', // {{position}} {{agents}}
                weWillEmailYou: 'Tack för ditt mail!', // {{mail}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            callback: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                weWillCallYou: 'Tack! Vi ringer dig på {{phoneNumber}}.',
                nonNumericPhoneNumber: 'Telefonnumret kan endast innehålla siffror.', // {{phoneNumber}}
                nonCanonicalPhoneNumber: 'Ange telefonnumret på formatet +46 70 234 56 78.', // {{phoneNumber}}
                phoneNumberAlreadyBooked:
                  'Det finns redan en begäran om uppringning till {{phoneNumber}}.',
                somethingWentWrong: 'Något gick fel. Försökt igen senare.',
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatContactMethod: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                chatCannotStart: 'Det går inte att starta en chatt här och nu.',
                chatStarted: 'Chatten har startat.',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatConversation: {
              sv: {
                chatStarting: 'Chatten startas...',
                chatHeader: 'Chatt',
                chatHeaderClosed: 'Chatten är avslutad',
                quitTooltip: 'Avsluta chatten',
                emailSent: 'E-post är skickad till dig.',
                emailError: 'Det gick inte att skicka e-post till dig.',
                errorMessage: 'Något blev fel',
                inputPlaceholder: 'Skriv ditt meddelande här...',
                emailPrompt: 'Du kan få chatten skickad till dig.',
                emailLabel: 'Din e-postadress',
                emailPlaceholder: 'e-postadress...',
                emailSkip: 'Nej tack',
                emailSubmit: 'Skicka',
                quitChat: 'Avsluta chatten',
                quitChatConfirm: 'Är du säker på att du vill avsluta chatten?',
                quitChatYes: 'Ja',
                quitChatNo: 'Nej',
                videoHeader: 'Videosamtal',
                videoAccept: 'Acceptera',
                videoDecline: 'Neka',
                videoWasAccepted: 'Videosamtal accepterades',
                videoWasDeclined: 'Videosamtal nekades',
                videoLoadingMessage: 'Laddar video…',
                videoHelpText:
                  'Om videon inte startar, tryck på knappen nedan för att byta till text',
                videoShowTextChat: 'Visa textchatten',
                chatDisconnected:
                  'Anslutningsproblem. Meddelanden kan bli försenade. Försöker återansluta ...',
                chatReconnected: 'Anslutning återställd.',
              },
            },
          },
        },
        
        {
          // If object has a companyName property, it is loaded only when companyNames match.
          // Otherwise the implementation is always loaded.

          // The URL to the Humany implementation and the version must be provided.
          // Note: Only version 4 and 5 implementations are supported.
           humanyUrl: 'https://folksam.humany.net/chattbot-sam-v5',
          version: 'v5',
          suppressContactCentreStatus: false,
          callback: {
            maxAvailableDates: 14,
            minuteInterval: 10,
          },
          chat: {
            enableWritingWhileInQueue: true,
            enableConversationHistoryTransfer: true,            
          },
          pluginTexts: {
            phone: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            email: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad svarstid är {{eqt}}.', // {{position}} {{agents}}
                weWillEmailYou: 'Tack för ditt mail!', // {{mail}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            callback: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                weWillCallYou: 'Tack! Vi ringer dig på {{phoneNumber}}.',
                nonNumericPhoneNumber: 'Telefonnumret kan endast innehålla siffror.', // {{phoneNumber}}
                nonCanonicalPhoneNumber: 'Ange telefonnumret på formatet +46 70 234 56 78.', // {{phoneNumber}}
                phoneNumberAlreadyBooked:
                  'Det finns redan en begäran om uppringning till {{phoneNumber}}.',
                somethingWentWrong: 'Något gick fel. Försökt igen senare.',
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatContactMethod: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                chatCannotStart: 'Det går inte att starta en chatt här och nu.',
                chatStarted: 'Chatten har startat.',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatConversation: {
              sv: {
                chatStarting: 'Chatten startas...',
                chatHeader: 'Chatt',
                chatHeaderClosed: 'Chatten är avslutad',
                quitTooltip: 'Avsluta chatten',
                emailSent: 'E-post är skickad till dig.',
                emailError: 'Det gick inte att skicka e-post till dig.',
                errorMessage: 'Något blev fel',
                inputPlaceholder: 'Skriv ditt meddelande här...',
                emailPrompt: 'Du kan få chatten skickad till dig.',
                emailLabel: 'Din e-postadress',
                emailPlaceholder: 'e-postadress...',
                emailSkip: 'Nej tack',
                emailSubmit: 'Skicka',
                quitChat: 'Avsluta chatten',
                quitChatConfirm: 'Är du säker på att du vill avsluta chatten?',
                quitChatYes: 'Ja',
                quitChatNo: 'Nej',
                videoHeader: 'Videosamtal',
                videoAccept: 'Acceptera',
                videoDecline: 'Neka',
                videoWasAccepted: 'Videosamtal accepterades',
                videoWasDeclined: 'Videosamtal nekades',
                videoLoadingMessage: 'Laddar video…',
                videoHelpText:
                  'Om videon inte startar, tryck på knappen nedan för att byta till text',
                videoShowTextChat: 'Visa textchatten',
                chatDisconnected:
                  'Anslutningsproblem. Meddelanden kan bli försenade. Försöker återansluta ...',
                chatReconnected: 'Anslutning återställd.',
              },
            },
          },
        },
        
      {
          // If object has a companyName property, it is loaded only when companyNames match.
          // Otherwise the implementation is always loaded.

          // The URL to the Humany implementation and the version must be provided.
          // Note: Only version 4 and 5 implementations are supported.
           humanyUrl: 'https://folksam.humany.net/genai-chatt',
          version: 'v5',
          suppressContactCentreStatus: false,
          callback: {
            maxAvailableDates: 14,
            minuteInterval: 10,
          },
          chat: {
            enableWritingWhileInQueue: true,
          },
          pluginTexts: {
            phone: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            email: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad svarstid är {{eqt}}.', // {{position}} {{agents}}
                weWillEmailYou: 'Tack för ditt mail!', // {{mail}}
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            callback: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                weWillCallYou: 'Tack! Vi ringer dig på {{phoneNumber}}.',
                nonNumericPhoneNumber: 'Telefonnumret kan endast innehålla siffror.', // {{phoneNumber}}
                nonCanonicalPhoneNumber: 'Ange telefonnumret på formatet +46 70 234 56 78.', // {{phoneNumber}}
                phoneNumberAlreadyBooked:
                  'Det finns redan en begäran om uppringning till {{phoneNumber}}.',
                somethingWentWrong: 'Något gick fel. Försökt igen senare.',
                closed: 'Stängt',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatContactMethod: {
              sv: {
                openingHours: 'Öppettider: {{hours}}',
                queueSituation: 'Beräknad kötid är {{eqt}}.', // {{position}} {{agents}}
                closed: 'Stängt',
                chatCannotStart: 'Det går inte att starta en chatt här och nu.',
                chatStarted: 'Chatten har startat.',
                getOpeningHoursError: null,
                getQueueSituationError: null,
              },
            },
            chatConversation: {
              sv: {
                chatStarting: 'Chatten startas...',
                chatHeader: 'Chatt',
                chatHeaderClosed: 'Chatten är avslutad',
                quitTooltip: 'Avsluta chatten',
                emailSent: 'E-post är skickad till dig.',
                emailError: 'Det gick inte att skicka e-post till dig.',
                errorMessage: 'Något blev fel',
                inputPlaceholder: 'Skriv ditt meddelande här...',
                emailPrompt: 'Du kan få chatten skickad till dig.',
                emailLabel: 'Din e-postadress',
                emailPlaceholder: 'e-postadress...',
                emailSkip: 'Nej tack',
                emailSubmit: 'Skicka',
                quitChat: 'Avsluta chatten',
                quitChatConfirm: 'Är du säker på att du vill avsluta chatten?',
                quitChatYes: 'Ja',
                quitChatNo: 'Nej',
                videoHeader: 'Videosamtal',
                videoAccept: 'Acceptera',
                videoDecline: 'Neka',
                videoWasAccepted: 'Videosamtal accepterades',
                videoWasDeclined: 'Videosamtal nekades',
                videoLoadingMessage: 'Laddar video…',
                videoHelpText:
                  'Om videon inte startar, tryck på knappen nedan för att byta till text',
                videoShowTextChat: 'Visa textchatten',
                chatDisconnected:
                  'Anslutningsproblem. Meddelanden kan bli försenade. Försöker återansluta ...',
                chatReconnected: 'Anslutning återställd.',
              },
            },
          },
        },
      ],
    },
  },

  /* ***************************************
   * COBROWSING
   *************************************** */

  coBrowsing: {
    conf: {
      // List of available cobrowsing engines as seen by the web site visitors.
      cobEngineVisitorList: [{ host: 'cob.ace.teliacompany.net/J3HKjqJt-visitor' }],
      // List of available cobrowsing engines as seen by the agents.
      cobEngineAgentList: [{ host: 'cob-dn.ace.teliacompany.net/J3HKjqJt-agent' }],

      // The TCP port number that web site visitors shall use
      // when connecting to the cobrowsing engines.
      cobVisitorSSLPort: 443,

      // The TCP port number that agents shall use when connecting to the cobrowsing engines.
      cobAgentSSLPort: 443,

      // Default time-out for microservices to cobrowsing engines, milliseconds.
      ajaxTimeout: 10000,

      // Lifetime for cobrowsing session cookies, minutes.
      sessionTime: 120,

      // List of elements to specifically transfer the computed style for.
      // For instance used to transfer styles triggered by a hover event.
      hoverElements: [],

      // The domFilter applies a jQuery selector in the DOM of the mirrored content at the agent,
      // applies additional style to the selected elements, and replaces their html content.
      // This can be used to hide (but still mark position of) e.g. the ACE Reference Chat Client or
      // elements with active content that not display correctly in the agent view.
      //
      // Syntax (example showing how to filter out ACE Reference Chat Client):
      domFilter: [
        {
          query: '.cg-chat-window',
          css: {
            border: '1px dashed #fe9b00',
            background: '#fe9b00',
            opacity: '0.5',
            'font-size': 'large',
          },
          html: 'CallGuide Chat',
        },
      ],

      // If only a certain part of the web site shall allow cobrowsing, set this array of regexp.
       includedPages: ['https://wds.ace.teliacompany.com/wds/instances/J3HKjqJt/example','https://stst.folksam.se:8443/minasidor'],

      // On excluded pages (regexp), the cobrowsing functionality is completely disabled.
      // This overrides includedPages.
      //excludedPages: ['chatClient.html', 'chatStandalone.html', 'chatRequest.html'],

      // Prevent or allow agents from sending clicks to visitor browser.
      // Note: A page or an input element can also control if clicks are executed,
      // by using the attribute data-cob-AgentClick='true'|'false'.
      AgentClick: false,

      // Prevent or allow agents from editing inputs in the web page.
      // 'true' means agents can edit, as default
      // 'false' means agents cannot edit and will not see the visitor's input, as default
      // 'read' means agents cannot edit, but can read the visitor's input, as default
      // Note: An element or a page can override the default setting, by setting the attribute
      // data-cob-AgentEdit to any of the three values.
      AgentEdit: 'read',
    },
  },

  /* ***************************************
   * PROACTIVE WEB
   *************************************** */

  proactiveWeb: {
    conf: {
      // Name of the proactive web engine instance to use
      instance: 'instanceTemplate',

      // URL for the proactive web engine server to use
      baseUrl: 'https://pwe.domain.ex/qualify',

      // Default timeout for requests to the proactive web engine
      ajaxTimeout: 30000, // milliseconds

      /*
      automaticOffers: true,
      templates: {
        Chat: 'pwTemplate_chat.mustache',
        Cb: 'pwTemplate_cb.mustache',
        ChatAndCb: 'pwTemplate_chatAndCb.mustache',
        Custom: 'pwTemplate_custom.mustache',
        CustomNoEntrance: 'pwTemplate_customNoEntrance.mustache',
      },
      */
    },
  },

  /* ***************************************
   * CHAT
   *************************************** */

  chat: {
    conf: {
      // Name of Chat Engine instance to use (NOT the Web SDK instance!)
      instance: 'J3HKjqJt',

      // URL for the chat engine server to use
      baseUrl: 'https://chat.ace.teliacompany.net/29/',
      //baseUrl: 'https://chat2.ace.teliacompany.net/26/',

      // Default timeout for requests to the chat engine, milliseconds
      ajaxTimeout: 20000,

      // Preferred clientID. If the page use more than one chat client, which one shall be used when
      // a chat is started by Proactive Web, for instance.
      preferredClientID: 'ACEReferenceChatClient',

      // ACE Reference Chat Client Configuration
      aceChatClientConfig: 'ACEChatConfig_sv.js',

      video: {
        // OpenTok video discontinued since Web SDK 28.0 and
        // replaced by Onsite video that do not have any configuration.
      },

      survey: {
        // Only links to these hosts are allowed for a Survey in chat client.
        // All other links will be shown as text links.
        // Rules for hosts:
        //   - Host should be text (and not regular expressions)
        //   - Only protocol ('https://') and host ('www.host.com/') part of an URL should be configured
        //   - For safety reasons, Web SDK will add a trailing slash ('/') to host if it is missing
        // Examples: 'https://host.com', 'http://host.com:80/', 'https://152.130.22.11/'
        validHosts: [
          'https://survey.labbn.se/', // Internal Telia test server!
          'https://survey.ccs.teliasonera.com/',
          'https://survey-dn.ace.teliacompany.com',
          'https://survey-dn.callguide.telia.com/',
          'https://survey.callguide.telia.com/',
          'https://survey.ace.teliacompany.com/',
        ],
      },

      knowledgeGuide: {
        // Only links to these hosts are allowed for Knowledge Guide links in chat client.
        // All other links will be shown as text links.
        // Rules for hosts:
        //   - Host should be text (and not regular expressions)
        //   - Only protocol ('https://') and host ('www.host.com/') part of an URL should be configured
        //   - For safety reasons, Web SDK will add a trailing slash ('/') to host if it is missing
        // Examples: 'https://host.com', 'http://host.com:80/', 'https://152.130.22.11/'
        validHosts: ['https://callguide-demo.humany.net/'],
      },
    },
  },

  /* ***************************************
   * INSTANCE SPECIFIC CSS and JS
   *************************************** */

  // Customizations of ACE Web SDK can be made by adding instance specific files. These files has
  // to be stored in the same server folder as the instance itself.

  // NOTE: Inclusion of ACE Reference Chat Client files has been moved (to conf.chat and features
  // sections in this configuration file) and should not be defined here!

  instanceSpecific: {
    conf: {
      // CSS files to append at the head element
      styles: [],

      // JavaScript files to append at the body element
      js: [
      'sessionTimeoutModal-v5.js',
      'customFunctionalityChatbot.js',
      
      'closingscript.js', 
      'selectboxRouteUrl.js',
      'preventPageScroll.js',
      'FaqScrollToGuide.js',
      'scrollToTopOnReload.js'
      ],
    },
  },
};
