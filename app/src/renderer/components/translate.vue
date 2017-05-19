<template>
  <div id="translate">
    <el-row>
      <el-col :span="24">
        <div class="grid-content">
          <el-input
           type="text"
           placeholder="请输入内容"
           v-model="originalContent"
           icon="search"
           :on-icon-click="translateHandler"
           @keyup.enter.native="translateHandler">
         </el-input>
        </div>
      </el-col>
    </el-row>
    <!-- 卡片 -->
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="grid-content">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix noselect"><span style="line-height: 18px;">Google</span></div>
            <div class="translate-content" v-loading="google_loading">
              <translateResult :contents="google_result" />
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix noselect"><span style="line-height: 18px;">Youdao</span></div>
            <div class="translate-content"  v-loading="youdao_loading">
              <translateResult :contents="youdao_result" />
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="grid-content">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix noselect"><span style="line-height: 18px;">Bing</span></div>
            <div class="translate-content"  v-loading="bing_loading">
              <translateResult :contents="bing_result" />
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix noselect"><span style="line-height: 18px;">Baidu</span></div>
            <div class="translate-content"  v-loading="baidu_loading">
              <translateResult :contents="baidu_result" />
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import translateResult from './translate-result'
  import jquery from 'jquery'
  import { ipcRenderer, clipboard } from 'electron'

  export default {
    created() {
      // 监听 quick_translating_notification 快捷键事件，获取粘贴板内容，进行翻译
      ipcRenderer.on('quick_translating_notification', (event, arg) => {
        var con = clipboard.readText()
        if (con.trim().length == 0) { return }
        this.originalContent = con
        this.translateHandler()
      })

      // 监听清理内容
      ipcRenderer.on('clean_content_notification', (e, arg) => {
        this.originalContent = ''
        this.cleanResults()
      })

    },
    components: {
      translateResult
    },
    data() {
      return {
          cardBodyStyle: { padding: 0 },
          originalContent: "",
          // originalContentIsZh: false,

          google_loading: false,
          youdao_loading: false,
          bing_loading: false,
          baidu_loading: false,

          google_result: [],
          youdao_result: [],
          bing_result: [],
          baidu_result: []
      }
    },
    props: [],
    methods: {
      cleanResults() {
        this.google_result = []
        this.youdao_result = []
        this.bing_result = []
        this.baidu_result = []
      },
      translateHandler() {
        this.cleanResults()
        this.translateByGoogle(this.originalContent)
        this.translateByYoudao(this.originalContent)
        this.translateByBing(this.originalContent)
        this.translateByBaidu(this.originalContent)
      },
      translateByGoogle(query) {
        this.google_loading = true
        var url = 'http://104.194.82.252:3000/google?query=' + query
        jquery.get(url, res => {
          this.google_loading = false
          this.google_result = [res]
        })
      },
      translateByYoudao(query) {
        this.youdao_loading = true
        var url = 'http://104.194.82.252:3000/youdao?query=' + query
        jquery.get(encodeURI(url), res => {
          this.youdao_loading = false
          try {
            var json = JSON.parse(res)
            this.youdao_result = json.translation
            this.youdao_result = jquery.merge(this.youdao_result, json.basic.explains)
          } catch (e) {}
        })
      },
      translateByBing(query) {
        this.bing_loading = true
        var url = 'http://104.194.82.252:3000/bing?query=' + query
        jquery.get(url, res => {
          this.bing_loading = false
          try {
            var json = JSON.parse(res)
            this.bing_result = json.defs.map((v) => { return v.def })
          } catch (e) {}
        })
      },
      translateByBaidu(query) {
        this.baidu_loading = true
        var url = 'http://104.194.82.252:3000/baidu?query=' + query
        jquery.get(encodeURI(url), res => {
          this.baidu_loading = false
          try {
            var json = JSON.parse(res)
            this.baidu_result = json.trans_result.data.map(function(v) {
              return v.dst
            })
            json.dict_result.simple_means.symbols[0].parts.forEach(function (v) {
              this.baidu_result.push(v.part + ' ' + v.means.join('，'))
            })
          } catch (e) {}
        })
      },
    },
  }
</script>

<style>
.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  min-height: 36px;
}
.box-card {
  width: 100%;
  height: 300px;
  padding: 0;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both
}
.translate-content {
  width: 100%;
  height: 245px;
  padding: 10px;
  overflow: scroll;
}
.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
