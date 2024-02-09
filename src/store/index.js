import { createStore } from 'vuex'

export default createStore({
  state: {
    Email: '',
    Password: '',
    accessToken: '',
    userInfo: [],
    selectedDay:'',
    overviewData:[],
    skuData:[],
    marketplace: '',
    sellerId: '',
    salesDate: ''
  },
  getters: {
    isAuthenticated(state) {
      return !!state.accessToken || !!localStorage.getItem('accessToken');
    },
    getUserInfo(state) {
      return state.userInfo;
    },
    getOverview(state){
      return state.overviewData
    },
    getSKUData(state){
      return state.skuData;
    }
  },
  mutations: {
    setEmail(state, Email) {
      state.Email = Email;
    },
    setPassword(state, Password) {
      state.Password = Password;
    },
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
    },
    setUserInformation(state, userInfo) { 
      state.userInfo = userInfo.Data.user;
    },
    clearUserData(state) {
      state.accessToken = '';
      localStorage.removeItem('accessToken');
    },
    setSelectedDay(state, selectedDay) {
      state.selectedDay = selectedDay;
  },
    setOverviewData(state,overviewData){
        state.overviewData= overviewData
    },
    setSKUData(state, data) {
      state.skuData = data;
    },
    updateSKUInfo(state, payload) {
      state.salesInfo = { ...payload };
    },
    updateSellerId(state, newSellerId) {
      state.sellerId = newSellerId;
    },
    updateMarketplace(state, newMarketplace) {
      state.marketplace = newMarketplace;
    },
    updateSalesDate(state, newSalesDate) {
      state.salesDate = newSalesDate;
    }
  },
  actions: {
    async login({ state, commit }) {
      try {
        const response = await fetch('https://iapitest.eva.guru/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "Email": state.Email,
            "Password": state.Password,
            "GrantType": "password",
            "Scope": "amazon_data",
            "ClientId": "C0001",
            "ClientSecret": "SECRET0001",
            "RedirectUri": "https://api.eva.guru"
          })
        });
    
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('API adresi bulunamadı.');
          } else {
            throw new Error('Beklenmeyen bir hata oluştu. HTTP durum kodu: ' + response.status);
          }
        }

        const data = await response.json();

        if (data) {
          localStorage.setItem('accessToken', data.Data.AccessToken);
          const accessToken = localStorage.getItem('accessToken');
          commit('setAccessToken', accessToken);
        } else {
          throw new Error('Token alınamadı');
        }
      } catch (error) {
        console.error('Giriş hatası:', error);
      }
    },
    async getUserInformation({ state, commit }) {
      try {
        const response = await fetch('https://iapitest.eva.guru/user/user-information', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.accessToken}` 
          },
          body: JSON.stringify({
            "email": state.Email
          })
        });

        if (!response.ok) {
          throw new Error('Kullanıcı bilgileri alınamadı');
        }
        
        const userInfo = await response.json();

        if (userInfo) {
          commit('setUserInformation', userInfo);
        } else {
          throw new Error('Kullanıcı bilgileri alınamadı');
        }
      } catch (error) {
        console.error('Kullanıcı bilgileri alınamadı:', error);
      }
    },
    async logout({ commit }) {
      try {
        commit('clearUserData');
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
    async fetchDataFromAPI({ state }) {
      try {
          const selectedDay = state.selectedDay; 
          console.log('action içerisindeki selected Day', selectedDay)
          var settings = {
              "url": "https://iapitest.eva.guru/data/daily-sales-overview",
              "method": "POST",
              "timeout": 0,
              "headers": {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
              },
              "data": JSON.stringify({
                  "marketplace": "Amazon.com",
                  "sellerId": "A3N2GBLFIDRYSH",
                  "requestStatus": 0,
                  "day": parseInt(selectedDay),
                  "excludeYoYData": true
              }),
          };

          const response = await fetch(settings.url, {
              method: settings.method,
              headers: settings.headers,
              body: settings.data
          });

          if (!response.ok) {
              throw new Error('Veri alınamadı');
          }

          const responseData = await response.json();
          this.commit('setOverviewData',responseData.Data.item)
      } catch (error) {
          console.error('Veri alınırken hata oluştu:', error);
      }
  },
  // async fetchSKUData({ commit, state }) {
  //   const sellerId = state.sellerId;
  //   const marketplace = state.marketplace;  
  //   const salesDate = state.salesDate;
  //   try {
  //     const settings = {
  //       url: "https://iapitest.eva.guru/data/daily-sales-sku-list",
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
  //       },
  //       data: JSON.stringify({
  //         "marketplace": marketplace,
  //         "sellerId": sellerId,
  //         "salesDate": salesDate,
  //         "salesDate2": "",
  //         "pageSize": 30,
  //         "pageNumber": 1,
  //         "isDaysCompare": 0
  //       })
  //     };

  //     const response = await fetch(settings.url, {
  //       method: settings.method,
  //       headers: settings.headers,
  //       body: settings.data
  //     });

  //     if (!response.ok) {
  //       throw new Error('Veri alınamadı');
  //     }

  //     const responseData = await response.json();
     
  //     commit('setSKUData', responseData.Data.item);
  //   } catch (error) {
  //     console.error('Veri alınırken hata oluştu:', error);
  //   }
  // }
  async fetchSKUData({ commit, state }) {
    const sellerId = state.sellerId;
    const marketplace = state.marketplace;  
    const salesDate = state.salesDate;
  
    try {
      const settings = {
        url: "https://iapitest.eva.guru/data/daily-sales-sku-list",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        data: JSON.stringify({
          "marketplace": marketplace,
          "sellerId": sellerId,
          "salesDate": salesDate,
          "salesDate2": "",
          "pageSize": 30,
          "pageNumber": 1,
          "isDaysCompare": 0
        })
      };
  
      const response = await fetch(settings.url, {
        method: settings.method,
        headers: settings.headers,
        body: settings.data
      });
  
      if (!response.ok) {
        throw new Error('Veri alınamadı');
      }
  
      const responseData = await response.json();
      const skuList = responseData.Data.item.skuList;
      const skuRefundRateSettings = {
        url: "https://iapitest.eva.guru/data/get-sku-refund-rate",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        data: JSON.stringify({
          "marketplace": marketplace,
          "sellerId": sellerId,
          "skuList": skuList,
          "requestedDay": 0
        })
      };
  
      const skuRefundRateResponse = await fetch(skuRefundRateSettings.url, {
        method: skuRefundRateSettings.method,
        headers: skuRefundRateSettings.headers,
        body: skuRefundRateSettings.data
      });
  
      if (!skuRefundRateResponse.ok) {
        throw new Error('SKU Refund Rate data could not be fetched');
      }
  
      const skuRefundRateData = await skuRefundRateResponse.json();
 
      commit('setSKUData', skuRefundRateData);
    } catch (error) {
      console.error('Veri alınırken hata oluştu:', error);
    }
  }
  },
  modules: {
  }
})
