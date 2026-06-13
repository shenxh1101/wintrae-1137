export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/health/index',
    'pages/service/index',
    'pages/emergency/index',
    'pages/family/index',
    'pages/profile/index',
    'pages/service-detail/index',
    'pages/health-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ff7d00',
    navigationBarTitleText: '智慧养老',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909c',
    selectedColor: '#ff7d00',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/health/index',
        text: '健康打卡'
      },
      {
        pagePath: 'pages/service/index',
        text: '服务预约'
      },
      {
        pagePath: 'pages/emergency/index',
        text: '紧急联系'
      },
      {
        pagePath: 'pages/profile/index',
        text: '个人中心'
      }
    ]
  }
})
