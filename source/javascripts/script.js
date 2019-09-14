var app = new Vue({
  el: '#app',
  data: {
    username: 'kayahino',
    initUrl: 'https://api.github.com/users/',
    page: 1,
    repos: [],
    switchUsername: false
  },
  created: function() {
    this.fetchApi()
    this.scroll()
  },
  watch: {
    username: function() {
      this.switchUsername = true
    }
  },
  methods: {
    fetchApi: function() {
      var self = this
      var getData = this.initUrl + this.username + '/repos?sort=updated&page=' + this.page + '&per_page=5'
      fetch(getData).then(response => {
          if (response.status !== 200) {
            alert('Oops, something went wrong!')
          }
          return response.json()
        })
        .then(data => {
          if (data.documentation_url === 'https://developer.github.com/v3/#rate-limiting') {
            alert('資料讀取錯誤：' + data.message)
            return
          }
          if (this.switchUsername) { this.repos = [] }
          self.switchUsername = false
          data.forEach(function(el) {
            self.repos.push(el)
          })
        })
        .then(() => {
          $('[data-toggle="tooltip"]').tooltip();
        })
        .catch(e => console.log("Oops, error", e))
    },
    dateFormat: function(date) {
      return date.slice(0, 10)
    },
    checkContent: function(content) {
      if (!content) {
        return 'No description.'
      } else {
        return content
      }
    },
    scroll: function() {
      var vm = this
      $(window).on('scroll', function() {
        var scrollPos = $(window).scrollTop()
        // infinite scroll
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
          if (vm.switchUsername || !vm.repos.length) { return }
          vm.page++
          vm.fetchApi()
        }
        $('.hero-bg').css('background-position-y', - 250 + (scrollPos / 2) + 'px')
        $('.hero h1').css('transform', 'translateY(' + (scrollPos / 3) + 'px)')
        $('.hero-link').css('transform', 'translateY(' + (scrollPos / 6) + 'px)')
      })
    },
    search: function() {
      this.fetchApi()
      $('body').animate({ scrollTop: 0 })
    }
  }
});