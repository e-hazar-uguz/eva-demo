<template>
 <Front>
<template v-slot:content>
<div class="main">
   <h1>Daily Sales Overview</h1> 
</div>
<div class="select-container">
    <select v-model="selectedDay" @change="handleDaySelection">
    <option value="7" >Last 7 days</option>
    <option value="14">Last 14 days</option>
    <option value="30">Last 30 days</option>
    <option value="60">Last 60 days</option>
</select>
</div>

</template>
 </Front>
 <div class="container-fluid">
    <div id="container" @click="handleChartClick"></div>
</div>
<h3 v-if="hazar" style="text-align: center;">The list shows data from {{ clickInfo }}</h3>
<div id="app" class="container-fluid" v-if="hazar">
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>#</th>
        <th>SKU</th>
        <th>Product Name</th>
        <th>Sales / Units - Avg. Selling Price</th>
        <th>SKU Refund Rate </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(data, index) in paginatedData" :key="index">
        <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
        <td>{{ data.sku.sku }}</td>
        <td>{{ data.sku.productName}}</td>
        <td style="color: green; font-weight: bold;">${{ data.sku.amount }} / {{ data.sku.qty }} 
            <br> ${{ data.sku.qty !== 0 ? data.sku.amount / data.sku.qty : 'Bölme işlemi tanımsızdır' }}</td>
        <td>{{ data.refundRate }}%</td>
      </tr>
    </tbody>
  </table>
    <nav aria-label="Page navigation" class="d-flex justify-content-end">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" aria-label="Previous" @click="prevPage">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
          <a class="page-link" href="#" @click="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" aria-label="Next" @click="nextPage">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
    <div id="salesDateInfo"></div>
</div>
</template>

<script>

import Front from '../layouts/Front.vue'
import store from '../../store'
import Highcharts from 'highcharts';
import { mapActions } from 'vuex';

export default {
  name: 'Home',
  components:{
Front
  },
  data() {
        return {
            selectedDay: '7',
            salesDate:'',
            sellerId:'',
            marketplace:'',
            hazar:false,
            currentPage: 1,
            pageSize: 5,
            clickInfo:''
        };
    },
  methods: {
    async handleDaySelection(event) {
        if (!event) {
        await this.$store.commit('setSelectedDay', this.selectedDay);
    }
    await this.$store.commit('setSelectedDay', event.target.value);
    await this.$store.dispatch('fetchDataFromAPI');
    await this.updateChart();
    },
   async updateChart() {
        let data = this.getOverview;
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Daily Sales',
                align: 'left'
            },
            xAxis: {
                categories: data.map(entry => {
                    // var dateParts = entry.date.split('-');
                    // var year = dateParts[0];
                    // var month = dateParts[1];
                    // var day = dateParts[2];
                    // return day + '-' + month + '-' + year;
                    var dateParts = entry.date.split('-');
    var year = dateParts[0];
    var month = dateParts[1];
    var day = dateParts[2];
    var dateObj = new Date(year, month - 1, day);
    var dayOfWeek = dateObj.toLocaleString('en', { weekday: 'long' });
    return day + '-' + month + '-' + year + ' ' + dayOfWeek;
                })
            },
            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: 'Amount ($)'
                }
            },
            tooltip: {
                shared: true,
                formatter: function() {
                    var tooltip = '<b>' + this.x + '</b><br/>';
                    this.points.forEach(point => {
                        if (point.series.name === 'Total Sales') {
                            var totalSales = point.point.fbaAmount + point.point.fbmAmount;
                            tooltip += 'Total Sales: ' + totalSales.toFixed(2) + '<br/>';
                        } else if (point.series.name === 'Shipping') {
                            tooltip += 'Shipping: ' + point.y.toFixed(2) + '<br/>';
                        } else if (point.series.name === 'Profit') {
                            tooltip += 'Profit: ' + point.y.toFixed(2) + '<br/>';
                        } else if (point.series.name === 'FBA Sales') {
                            tooltip += 'FBA Sales: ' + point.y.toFixed(2) + '<br/>';
                        } else if (point.series.name === 'FBM Sales') {
                            tooltip += 'FBM Sales: ' + point.y.toFixed(2) + '<br/>';
                        }
                    });
                    return tooltip;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            series: [{
                name: 'Profit',
                data: data.map(entry => entry.profit)
            }, {
                name: 'FBA Sales',
                data: data.map(entry => entry.fbaAmount)
            }, {
                name: 'FBM Sales',
                data: data.map(entry => entry.fbmAmount)
            }]
        });
    },
    handleChartClick(event) {
        this.hazar=true
      if (event.point) {
        const sellerId = this.getUserInfo.store[0].storeId;
        const marketplace = this.getUserInfo.store[0].marketplaceName;
        let date = event.point.category.split(" ")[0];
        const salesDate = date.split("-").reverse().join("-");
        this.clickInfo=event.point.category
        this.$store.commit('updateSellerId', sellerId);
        this.$store.commit('updateMarketplace', marketplace);
        this.$store.commit('updateSalesDate', salesDate);
        this.fetchSKUData();
      }
    },
    ...mapActions(['fetchSKUData']),
    changePage(page) {
      this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
},
computed:{
      getOverview(){
        return store.getters.getOverview
      },
      getSKUData(){
        let data = store.getters.getSKUData.Data
        return data
      },
      getUserInfo(){
        return store.getters.getUserInfo
      },
      paginatedData() {
      if (!this.getSKUData || this.getSKUData.length === 0) {
        return [];
      }
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.getSKUData.slice(startIndex, endIndex);
    },
    totalPages() {
      if (!this.getSKUData || this.getSKUData.length === 0) {
        return 0; 
      }
      return Math.ceil(this.getSKUData.length / this.pageSize);
    }

    },
    mounted() {
    let data =this.getOverview 
    Highcharts.chart('container', {

chart: {
    type: 'column'
},

title: {
    text: 'Daily Sales',
    align: 'left'
},

xAxis: {
    categories: data.map(entry => {
            var dateParts = entry.date.split('-');
            var year = dateParts[0];
            var month = dateParts[1];
            var day = dateParts[2];
            return day + '-' + month + '-' + year;
        })
},

yAxis: {
    allowDecimals: false,
    min: 0,
    title: {
        text: 'Amount ($)'
    }
},
tooltip: {
        shared: true,
        formatter: function() {
            var tooltip = '<b>' + this.x + '</b><br/>';
            this.points.forEach(point => {
                if (point.series.name === 'Total Sales') {
                    var totalSales = point.point.fbaAmount + point.point.fbmAmount;
                    tooltip += 'Total Sales: ' + totalSales.toFixed(2) + '<br/>';
                } else if (point.series.name === 'Shipping') {
                    tooltip += 'Shipping: ' + point.y.toFixed(2) + '<br/>';
                } else if (point.series.name === 'Profit') {
                    tooltip += 'Profit: ' + point.y.toFixed(2) + '<br/>';
                } else if (point.series.name === 'FBA Sales') {
                    tooltip += 'FBA Sales: ' + point.y.toFixed(2) + '<br/>';
                } else if (point.series.name === 'FBM Sales') {
                    tooltip += 'FBM Sales: ' + point.y.toFixed(2) + '<br/>';
                }
            });
            return tooltip;
        }
    },
    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },
    series: [{
        name: 'Profit',
        data: data.map(entry => entry.profit)
    }, {
        name: 'FBA Sales',
        data: data.map(entry => entry.fbaAmount)
    }, {
        name: 'FBM Sales',
        data: data.map(entry => entry.fbmAmount)
    }]
},);

  },
 async created() {
    await this.$store.commit('setSelectedDay', this.selectedDay);
    await this.$store.dispatch('fetchDataFromAPI');
    await this.updateChart();
    if(this.hazar==true){
        this.fetchSKUData();
    }
  }
}
</script>


<style scoped>
.main{
    text-align: center;
    margin-top: 1rem;
}
.highcharts-figure,
.highcharts-data-table table {
    min-width: 310px;
    max-width: 800px;
    margin: 1em auto;
}

.highcharts-data-table table {
    font-family: Verdana, sans-serif;
    border-collapse: collapse;
    border: 1px solid #ebebeb;
    margin: 10px auto;
    text-align: center;
    width: 100%;
    max-width: 500px;
}

.highcharts-data-table caption {
    padding: 1em 0;
    font-size: 1.2em;
    color: #555;
}

.highcharts-data-table th {
    font-weight: 600;
    padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
    padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tr:nth-child(even) {
    background: #f8f8f8;
}

.highcharts-data-table tr:hover {
    background: #f1f7ff;
}

#button-bar {
    min-width: 310px;
    max-width: 800px;
    margin: 0 auto;
}
.select-container {
    text-align: right;
}
.pagination {
  display: flex;
  list-style: none;
}

.page-item {
  margin: 0 2px;
}

.page-link {
  cursor: pointer;
}
</style>
