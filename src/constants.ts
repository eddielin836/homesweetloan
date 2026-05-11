/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LoanScheme } from './types';

export const SCHEME_LABELS: Record<LoanScheme, string> = {
  [LoanScheme.NEW_YOUTH]: '青年安心成家貸款',
  [LoanScheme.NEST_NEST]: '築巢優利貸',
  [LoanScheme.GENERAL_FIRST]: '一般首購'
};

export const SCHEME_DEFAULT_RATES: Record<LoanScheme, number> = {
  [LoanScheme.NEW_YOUTH]: 2.275,
  [LoanScheme.NEST_NEST]: 2.185,
  [LoanScheme.GENERAL_FIRST]: 2.585
};

export const SCHEME_DEFAULT_YEARS: Record<LoanScheme, number> = {
  [LoanScheme.NEW_YOUTH]: 40,
  [LoanScheme.NEST_NEST]: 40,
  [LoanScheme.GENERAL_FIRST]: 30
};

export interface TaiwanCity {
  name: string;
  livingExpense: number;
  zones: {
    A: string[];
    B: string[];
    C: string[];
    D: string[];
  };
}

export const SPECIAL_VILLAGES: Record<string, string[]> = {
  '三峽區': ['龍學里', '龍恩里', '龍埔里', '永舘里'],
  '大園區': ['橫峰里', '青山里', '青埔里', '青峰里'],
  '龜山區': ['樂善里', '文化里', '長庚里', '文青里', '大湖里', '大華里'],
  '烏日區': ['三和里', '湖日里'],
  '歸仁區': ['武東里', '沙崙里'],
  '橋頭區': ['新莊里'],
  '吉安鄉': ['北昌村', '永安村', '勝安村', '慶豐村', '宜昌村', '南昌村', '仁里村', '東昌村', '太昌村', '吉安村']
};

export const TAIWAN_CITIES: TaiwanCity[] = [
  { 
    name: '台北市', 
    livingExpense: 21000, 
    zones: {
      A: ['中正區', '大安區', '信義區', '中山區', '松山區', '內湖區', '士林區', '南港區', '文山區', '北投區', '萬華區', '大同區'],
      B: [],
      C: [],
      D: []
    }
  },
  { 
    name: '新北市', 
    livingExpense: 18000, 
    zones: {
      A: ['板橋區', '三重區', '永和區', '中和區', '新店區', '新莊區', '土城區', '汐止區', '蘆洲區', '淡水區', '林口區', '五股區', '泰山區', '樹林區'],
      B: ['鶯歌區', '三峽區', '八里區', '深坑區'],
      C: ['三芝區', '金山區', '萬里區', '瑞芳區'],
      D: ['石碇區', '平溪區', '貢寮區', '雙溪區', '烏來區', '坪林區', '石門區']
    }
  },
  { 
    name: '桃園市', 
    livingExpense: 18000, 
    zones: {
      A: ['桃園區', '中壢區', '平鎮區', '八德區', '蘆竹區'],
      B: ['龜山區', '龍潭區', '楊梅區', '大園區'],
      C: ['大溪區', '觀音區', '新屋區'],
      D: ['復興區']
    }
  },
  { 
    name: '台中市', 
    livingExpense: 17000, 
    zones: {
      A: ['南屯區', '西區', '西屯區', '東區', '中區', '南區', '北屯區', '北區', '豐原區', '大里區', '太平區', '大雅區', '潭子區', '沙鹿區'],
      B: ['烏日區', '霧峰區', '清水區', '大甲區', '梧棲區', '龍井區', '神岡區'],
      C: ['后里區', '東勢區', '大肚區', '外埔區'],
      D: ['新社區', '和平區', '石岡區', '大安區']
    }
  },
  { 
    name: '台南市', 
    livingExpense: 16000, 
    zones: {
      A: ['中西區', '東區', '北區', '安平區', '南區', '安南區', '永康區', '仁德區', '善化區', '新市區', '新營區'],
      B: ['歸仁區', '佳里區', '新化區', '安定區', '麻豆區'],
      C: ['白河區', '學甲區', '鹽水區', '西港區', '後壁區', '柳營區', '七股區'],
      D: ['玉井區', '東山區', '六甲區', '下營區', '山上區', '將軍區', '大內區', '楠西區', '南化區', '左鎮區', '龍崎區', '關廟區', '官田區', '北門區']
    }
  },
  { 
    name: '高雄市', 
    livingExpense: 17000, 
    zones: {
      A: ['苓雅區', '左營區', '三民區', '前鎮區', '前金區', '鼓山區', '新興區', '鳳山區', '楠梓區', '仁武區', '鹽埕區', '小港區'],
      B: ['鳥松區', '旗津區', '岡山區', '大寮區', '橋頭區'],
      C: ['路竹區', '林園區', '大社區', '梓官區', '燕巢區', '美濃區', '湖內區', '大樹區', '永安區', '旗山區'],
      D: ['田寮區', '彌陀區', '茄萣區', '六龜區', '甲仙區', '杉林區', '內門區', '茂林區', '桃源區', '那瑪夏區', '阿蓮區']
    }
  },
  { 
    name: '基隆市', 
    livingExpense: 16000, 
    zones: {
      A: [],
      B: ['中山區', '中正區', '仁愛區', '信義區', '安樂區', '七堵區'],
      C: ['暖暖區'],
      D: []
    }
  },
  { 
    name: '新竹市', 
    livingExpense: 16000, 
    zones: {
      A: ['東區', '北區'],
      B: ['香山區'],
      C: [],
      D: []
    }
  },
  { 
    name: '新竹縣', 
    livingExpense: 16000, 
    zones: {
      A: ['竹北市'],
      B: ['竹東鎮', '新豐鄉', '湖口鄉', '芎林鄉', '新埔鎮', '寶山鄉'],
      C: ['關西鎮'],
      D: ['北埔鄉', '五峰鄉', '峨眉鄉', '橫山鄉', '尖石鄉']
    }
  },
  { 
    name: '苗栗縣', 
    livingExpense: 16000, 
    zones: {
      A: ['竹南鎮', '頭份市', '苗栗市'],
      B: [],
      C: ['公館鄉', '三義鄉', '後龍鎮', '南庄鄉', '銅鑼鄉', '大湖鄉', '苑裡鎮', '通宵鎮', '造橋鄉', '西湖鄉'],
      D: ['卓蘭鎮', '獅潭鄉', '三灣鄉', '泰安鄉', '頭屋鄉', '通霄鎮']
    }
  },
  { 
    name: '彰化縣', 
    livingExpense: 16000, 
    zones: {
      A: ['彰化市', '員林市'],
      B: ['鹿港鎮', '和美鎮', '北斗鎮', '溪湖鎮', '田中鎮', '大村鄉', '埔心鄉', '秀水鄉', '社頭鄉', '永靖鄉', '花壇鄉'],
      C: ['福興鄉', '二林鎮', '埔鹽鄉', '田尾鄉', '芬園鄉', '溪州鄉', '二水鄉', '埤頭鄉', '線西鄉', '伸港鄉'],
      D: ['大城鄉', '芳苑鄉', '竹塘鄉']
    }
  },
  { 
    name: '南投縣', 
    livingExpense: 16000, 
    zones: {
      A: ['南投市', '埔里鎮'],
      B: ['草屯鎮'],
      C: ['竹山鎮', '水里鄉', '國姓鄉', '鹿谷鄉', '集集鎮', '名間鄉', '魚池鄉'],
      D: ['仁愛鄉', '信義鄉', '中寮鄉']
    }
  },
  { 
    name: '雲林縣', 
    livingExpense: 16000, 
    zones: {
      A: ['斗六市'],
      B: ['虎尾鎮', '斗南鎮', '北港鎮', '西螺鎮'],
      C: ['莿桐鄉', '土庫鎮', '四湖鄉', '麥寮鄉', '古坑鄉'],
      D: ['台西鄉', '水林鄉', '口湖鄉', '元長鄉', '大埤鄉', '褒忠鄉', '東勢鄉', '崙背鄉', '林內鄉', '二崙鄉']
    }
  },
  { 
    name: '嘉義市', 
    livingExpense: 16000, 
    zones: {
      A: ['東區', '西區'],
      B: [],
      C: [],
      D: []
    }
  },
  { 
    name: '嘉義縣', 
    livingExpense: 16000, 
    zones: {
      A: ['太保市'],
      B: ['朴子市', '中埔鄉', '水上鄉', '民雄鄉'],
      C: ['新港鄉', '大林鎮', '布袋鎮'],
      D: ['番路鄉', '梅山鄉', '阿里山鄉', '大埔鄉', '東石鄉', '溪口鄉', '義竹鄉', '竹崎鄉', '六腳鄉', '鹿草鄉']
    }
  },
  { 
    name: '屏東縣', 
    livingExpense: 16000, 
    zones: {
      A: ['屏東市', '東港鎮'],
      B: ['潮州鎮'],
      C: ['萬丹鄉', '內埔鄉', '麟洛鄉', '里港鄉', '鹽埔鄉', '高樹鄉', '恆春鎮', '九如鄉', '新園鄉', '林邊鄉', '長治鄉'],
      D: ['萬巒鄉', '枋寮鄉', '佳冬鄉', '竹田鄉', '新埤鄉', '崁頂鄉', '琉球鄉', '車城鄉', '滿州鄉', '枋山鄉', '三地門鄉', '霧臺鄉', '瑪家鄉', '泰武鄉', '來義鄉', '春日鄉', '獅子鄉', '牡丹鄉', '南州鄉']
    }
  },
  { 
    name: '宜蘭縣', 
    livingExpense: 16000, 
    zones: {
      A: ['宜蘭市', '羅東鎮'],
      B: ['冬山鄉', '礁溪鄉', '蘇澳鎮', '五結鄉', '壯圍鄉'],
      C: ['員山鄉', '頭城鎮', '三星鄉'],
      D: ['南澳鄉', '大同鄉']
    }
  },
  { 
    name: '花蓮縣', 
    livingExpense: 16000, 
    zones: {
      A: ['花蓮市', '吉安鄉(特定區)'],
      B: ['吉安鄉'],
      C: ['新城鄉', '壽豐鄉'],
      D: ['富里鄉', '萬榮鄉', '卓溪鄉', '豐濱鄉', '秀林鄉', '玉里鎮', '鳳林鎮', '光復鄉', '瑞穗鄉']
    }
  },
  { 
    name: '台東縣', 
    livingExpense: 16000, 
    zones: {
      A: ['臺東市'],
      B: [],
      C: ['池上鄉', '關山鎮', '成功鎮', '卑南鄉'],
      D: ['鹿野鄉', '東河鄉', '長濱鄉', '太麻里鄉', '大武鄉', '綠島鄉', '延平鄉', '海端鄉', '達仁鄉', '金峰鄉', '蘭嶼鄉']
    }
  },
  { 
    name: '澎湖縣', 
    livingExpense: 16000, 
    zones: {
      A: ['馬公市'],
      B: ['湖西鄉'],
      C: [],
      D: ['白沙鄉', '西嶼鄉', '望安鄉', '七美鄉']
    }
  },
  { 
    name: '金門縣', 
    livingExpense: 16000, 
    zones: {
      A: [],
      B: ['金城鎮', '金湖鎮', '金寧鄉'],
      C: ['金沙鎮'],
      D: ['烈嶼鄉', '烏坵鄉']
    }
  },
  { 
    name: '連江縣', 
    livingExpense: 16000, 
    zones: {
      A: [],
      B: [],
      C: [],
      D: ['南竿鄉', '北竿鄉', '莒光鄉', '東引鄉']
    }
  }
];

export const CITY_BY_NAME: ReadonlyMap<string, TaiwanCity> = new Map(TAIWAN_CITIES.map(c => [c.name, c]));

// Magic numbers
export const MAX_AGE_AT_LOAN_END = 89;
export const MAX_HOUSE_AGE_PLUS_TERM = 50;
export const OLD_HOUSE_TERM_PENALTY_YEARS = 3;
export const DEFAULT_LIVING_EXPENSE = 16000;

export const DTI_RATIOS = {
  LTV_80_PLUS: 1.8,
  LTV_75: 1.6,
  LTV_70: 1.4,
  LTV_65: 1.2,
  LTV_60: 1.0,
} as const;

export const GRACE_PERIOD_RATIOS = {
  SHORT: 2.0,
  LONG: 2.5
} as const;

export const GRACE_LONG_THRESHOLD_YEARS = 3;

export const LTV_LADDER_DEFAULT = [0.8, 0.75, 0.7, 0.65, 0.6] as const;
export const LTV_LADDER_NEST_NEST = [0.85, 0.8, 0.75, 0.7, 0.65, 0.6] as const;

export const GRACE_DEFAULT_LTV = 0.8;
export const GRACE_DEFAULT_LTV_NEST_NEST = 0.85;
