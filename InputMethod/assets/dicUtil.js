import { dict } from './dic.js'

const _cwK = "可有是一人这上中大会来以会能到说出对那又看把好从多让还被最已我他你她它们着就都而很还没没什让怎为如但所那或与其她它更被把从没让向去用经进因然点情样工家级经开动方面手次安心定思总真实原品问感应化回";
const _cwV = "能以为经已的在了人我个了是这过到在会也的个我人们大工样件种来下面以国文心华小多学后为可员主不否够够底处来时话明道发去现于不起你些么里是能要再见不到起给握住像了不很自没到开给步是有没又叫受由这那将而来中到有法关我给他上往中年过回来户在不所常过已济行入步以此故而虽儿什东况况况形子式西作厂人乡庭别等最高过常已始发会放力运移式面法位前条全对机段心大一回第几全装平定里想中意定义确决时想考法意见思味义是共体数的是正假际在现确因来则本质牌种名题答什怎觉情兴趣该当用反变文会合来答去过";
const _cwL = { '可':4,'有':5,'一':4,'不':4,'是':3,'人':3,'这':3,'上':3,'中':3,'大':3,'来':3,'以':3,'会':2,'能':3,'到':3,'说':3,'出':3,'对':3,'那':3,'又':3,'看':3,'把':3,'好':3,'从':3,'多':3,'让':3,'还':3,'被':3,'最':3,'已':3,'我':3,'他':3,'你':3,'她':3,'它':3,'们':2,'着':3,'就':3,'都':3,'而':3,'很':3,'没':3,'什':3,'怎':3,'为':3,'因':3,'如':3,'但':3,'所':3,'或':3,'与':3,'其':3,'更':3,'向':3,'去':3,'用':3,'经':3,'进':3,'点':3,'情':3,'样':3,'工':3,'家':3,'级':3,'开':3,'动':3,'方':3,'面':3,'手':3,'次':3,'安':3,'心':3,'定':3,'思':3,'总':3,'真':3,'实':3,'原':3,'品':3,'问':3,'感':3,'应':3,'化':3,'回':3 };

const T9_KEYS = ["abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"];
const T9_DIGITS = {a:2,b:2,c:2,d:3,e:3,f:3,g:4,h:4,i:4,j:5,k:5,l:5,m:6,n:6,o:6,p:7,q:7,r:7,s:7,t:8,u:8,v:8,w:9,x:9,y:9,z:9};
let _py2hz2 = null, _T9_MAP = null, _allDigits = null;

function _getPy2hz2() {
  if (_py2hz2) return _py2hz2;
  _py2hz2 = {};
  const initials = "bpmfdtnlgkhjqxzcsryw";
  for (let i = 0; i < initials.length; i++) {
    const init = initials[i], buf = [];
    for (const py in dict) {
      if (py[0] === init || (init === 's' && py[0] === 's') || (init === 'c' && py[0] === 'c') || (init === 'z' && py[0] === 'z')) {
        buf.push(dict[py]);
      }
    }
    if (buf.length) _py2hz2[init] = buf.join("");
  }
  for (const single of ["a","e","o"]) { if (dict[single]) _py2hz2[single] = dict[single]; }
  _py2hz2["i"] = "i"; _py2hz2["u"] = "u"; _py2hz2["v"] = "v";
  return _py2hz2;
}

function _buildT9Map() {
  if (_T9_MAP) return;
  _T9_MAP = {}; _allDigits = [];
  const p2h = _getPy2hz2();
  const allPy = Object.keys(dict);
  for (let i = 0; i < allPy.length; i++) {
    const py = allPy[i];
    let digits = "";
    for (let j = 0; j < py.length && j < 6; j++) {
      const d = T9_DIGITS[py[j]];
      if (!d) { digits = ""; break; }
      digits += d;
    }
    if (!digits || digits.length < 1) continue;
    if (!_T9_MAP[digits]) _T9_MAP[digits] = [];
    const hz = p2h[py] || dict[py] || "";
    if (hz) _T9_MAP[digits].push({ py: py, c: hz });
  }
  for (const d in _T9_MAP) {
    _T9_MAP[d].sort((a, b) => b.c.length - a.c.length);
    _allDigits.push(d);
  }
  _allDigits.sort((a, b) => a.length - b.length);
}

function _t9Digits(history) {
  let s = "";
  for (let i = 0; i < history.length; i++) {
    const idx = T9_KEYS.indexOf(history[i].key);
    if (idx >= 0) s += (idx + 2);
  }
  return s;
}

function _letterPrefix(history) {
  let s = "";
  for (let i = 0; i < history.length; i++) {
    s += history[i].letters[history[i].index];
  }
  return s;
}

function _prefixMatch(digits, maxLen) {
  const results = [];
  for (let i = 0; i < _allDigits.length && _allDigits[i].length <= maxLen; i++) {
    if (_allDigits[i].indexOf(digits) === 0) {
      const arr = _T9_MAP[_allDigits[i]];
      for (let j = 0; j < arr.length; j++) { results.push(arr[j]); }
    }
  }
  return results;
}

function _getCommonWordHints(lastChar) {
  const idx = _cwK.indexOf(lastChar);
  if (idx < 0) return '';
  let start = 0;
  for (let i = 0; i < idx; i++) { start += (_cwL[_cwK[i]] || 3); }
  return _cwV.substr(start, _cwL[lastChar] || 3);
}

const SimpleInputMethod = {
    dict: null,
    initialized: true,

    _ensureDict() {
      if (!this.dict) this.dict = { py2hz: dict, py2hz2: _getPy2hz2() };
    },

    getSingleHanzi(pinyin) {
        this._ensureDict();
        const p2h = _getPy2hz2();
        return p2h[pinyin] || dict[pinyin] || '';
    },

    getHanzi(pinyin) {
        let result = this.getSingleHanzi(pinyin);
        if (result) return [result.split(''), pinyin];
        const start = Math.min(pinyin.length, 6);
        for (let i = start; i >= 1; i--) {
            const str = pinyin.substr(0, i);
            const rs = this.getSingleHanzi(str);
            if (rs) return [rs.split(''), str];
        }
        return [[], ''];
    },

    getWordHints(lastChar) {
        return _getCommonWordHints(lastChar);
    },

    getT9Matches(t9History, prefix) {
      _buildT9Map();
      const digits = _t9Digits(t9History);
      const lprefix = _letterPrefix(t9History);
      const matches = [];
      const seen = {};

      if (digits) {
        const exact = _T9_MAP[digits];
        if (exact) {
          for (let i = 0; i < exact.length; i++) {
            const item = exact[i];
            if (!seen[item.py]) { seen[item.py] = 1; matches.push(item); }
          }
        }

        const maxLen = Math.min(digits.length + 3, 6);
        const extras = _prefixMatch(digits, maxLen);
        for (let i = 0; i < extras.length; i++) {
          if (!seen[extras[i].py]) { seen[extras[i].py] = 1; matches.push(extras[i]); }
        }
      }

      if (lprefix && matches.length > 1) {
        matches.sort((a, b) => {
          const sa = a.py.startsWith(lprefix) ? 0 : (a.py > lprefix ? 1 : 2);
          const sb = b.py.startsWith(lprefix) ? 0 : (b.py > lprefix ? 1 : 2);
          return sa - sb || b.c.length - a.c.length;
        });
      } else if (matches.length > 1) {
        matches.sort((a, b) => b.c.length - a.c.length);
      }

      let pd = "";
      if (prefix) {
        for (let j = 0; j < prefix.length; j++) {
          const d = T9_DIGITS[prefix[j]];
          if (d) pd += d;
        }
      }
      if (pd && _T9_MAP[pd]) {
        const arr = _T9_MAP[pd];
        for (let i = 0; i < arr.length; i++) {
          if (!seen[arr[i].py]) { seen[arr[i].py] = 1; matches.push(arr[i]); }
        }
      }

      return matches;
    }
};

export { SimpleInputMethod }
