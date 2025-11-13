interface ChatResponse {
  mr: string;
  hi: string;
  en: string;
}

const responses: Record<string, ChatResponse> = {
  irrigation: {
    mr: 'तुमच्या शेतातील माती 18% ओलावा दर्शवत आहे. 4 तासांत पाणी देणे आवश्यक आहे.',
    hi: 'आपके खेत में मिट्टी की नमी 18% है। 4 घंटों में सिंचाई करें।',
    en: 'Your soil moisture is at 18%. Irrigation is advised within 4 hours.'
  },
  fertilizer: {
    mr: 'NPK (12-32-16) @ 75 kg/एकर वापरा. 3 फटक्यांत द्या.',
    hi: 'NPK (12-32-16) @ 75 kg/एकड़ का उपयोग करें। 3 चरणों में दें।',
    en: 'Use NPK (12-32-16) @ 75 kg/acre. Apply in 3 splits.'
  },
  disease: {
    mr: 'पानांवर डाग दिसत आहेत. मॅनकोझेब 0.25% फवारा करा.',
    hi: 'पत्तियों पर धब्बे दिख रहे हैं। Mancozeb 0.25% का छिड़काव करें।',
    en: 'Leaf spots detected. Apply Mancozeb 0.25% spray.'
  },
  weather: {
    mr: 'उद्या हलका पाऊस अपेक्षित आहे (70%). सिंचनास 48 तासांनी स्थगिती द्या.',
    hi: 'कल हल्की बारिश की संभावना है (70%)। सिंचाई 48 घंटे के लिए स्थगित करें।',
    en: 'Light rain expected tomorrow (70%). Delay irrigation by 48 hours.'
  },
  pest: {
    mr: 'पांढऱ्या गब्बर जीवांची शक्यता. Chlorpyriphos 20 EC @ 2.5 L/एकर वापरा.',
    hi: 'सफेद ग्रब का खतरा। Chlorpyriphos 20 EC @ 2.5 L/एकड़ का प्रयोग करें।',
    en: 'White grub risk detected. Use Chlorpyriphos 20 EC @ 2.5 L/acre.'
  },
  market: {
    mr: 'आजचा कांदा बाजारभाव: ₹1200-1800/क्विंटल (पुणे APMC)',
    hi: 'आज का प्याज बाजार भाव: ₹1200-1800/क्विंटल (पुणे APMC)',
    en: 'Today\'s onion market rate: ₹1200-1800/quintal (Pune APMC)'
  },
  subsidy: {
    mr: 'ठिबक सिंचनावर 50% अनुदान उपलब्ध आहे. कृषी विभागाशी संपर्क साधा.',
    hi: 'ड्रिप सिंचाई पर 50% सब्सिडी उपलब्ध है। कृषि विभाग से संपर्क करें।',
    en: 'Drip irrigation subsidy: 50% available. Contact agriculture department.'
  },
  ndvi: {
    mr: 'तुमच्या शेताचा NDVI: 0.78 (चांगला). हिरव्या वनस्पतींची घनता चांगली आहे.',
    hi: 'आपके खेत का NDVI: 0.78 (अच्छा)। हरी वनस्पति घनत्व अच्छी है।',
    en: 'Your field NDVI: 0.78 (Good). Green vegetation density is healthy.'
  },
  default: {
    mr: 'मला माफ करा, मी तुमचा प्रश्न समजू शकलो नाही. कृपया "पाणी", "खत", "रोग", "हवामान", "बाजार" यापैकी एक विषय निवडा.',
    hi: 'क्षमा करें, मैं आपका सवाल नहीं समझ सका। कृपया "पानी", "खाद", "रोग", "मौसम", "बाजार" में से एक विषय चुनें।',
    en: 'Sorry, I didn\'t understand your question. Please ask about: irrigation, fertilizer, disease, weather, or market.'
  }
};

export const getChatbotResponse = (message: string, language: string = 'mr'): string => {
  const lowerMsg = message.toLowerCase();
  
  const keywords = {
    irrigation: ['irrigation', 'water', 'पाणी', 'सिंचाई', 'सिंचन', 'पानी'],
    fertilizer: ['fertilizer', 'खत', 'खाद', 'npk', 'nitrogen'],
    disease: ['disease', 'रोग', 'बीमारी', 'pest', 'कीट', 'leaf'],
    weather: ['weather', 'हवामान', 'मौसम', 'rain', 'पाऊस', 'बारिश'],
    pest: ['pest', 'कीट', 'grub', 'aphid'],
    market: ['market', 'बाजार', 'price', 'किंमत', 'भाव'],
    subsidy: ['subsidy', 'अनुदान', 'सहाय्य', 'scheme', 'योजना'],
    ndvi: ['ndvi', 'satellite', 'vegetation']
  };
  
  for (const [key, words] of Object.entries(keywords)) {
    if (words.some(word => lowerMsg.includes(word))) {
      return responses[key][language as keyof ChatResponse] || responses[key].en;
    }
  }
  
  return responses.default[language as keyof ChatResponse] || responses.default.en;
};
