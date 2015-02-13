class SV {
  JsVar *v;
  bool owned;
public:
  inline __attribute__((always_inline)) SV(JsVar *value) {
    owned = true;
    v=value;
  }
  inline __attribute__((always_inline)) ~SV() {
    if (owned) jsvUnLock(v);
  }
  inline __attribute__((always_inline)) operator JsVar*() const { return v; }
  static inline __attribute__((always_inline)) SV notOwned(JsVar *value) {
    SV s = SV(value);
    s.owned = false;
    return s;
  }
  inline __attribute__((always_inline)) JsVar *give() {
    owned = false;
    return v;
  }
};

