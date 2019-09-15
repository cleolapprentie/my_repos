var app = new Vue({
  el: '#app',
  data: {
    username: 'kayahino',
    initUrl: 'https://api.github.com/users/',
    page: 1,
    repos: [],
    checkData: [],
    switchUsername: false,
    loading: false,
    error: false,
    next: true
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
      this.loading = true
      var getData = this.initUrl + this.username + '/repos?sort=updated&page=' + this.page + '&per_page=5'
      fetch(getData).then(response => {
          if (response.status !== 200) {
            alert('Oops, something went wrong!')
          }
          return response.json()
        })
        .then(data => {
          setTimeout(function() {
            self.loading = false
            if (data.documentation_url === 'https://developer.github.com/v3/#rate-limiting') {
              alert('資料讀取錯誤：' + data.message)
              self.error = true
              return
            } else if (!data.length) {
              self.next = false
            }
            self.switchUsername = false
            data.forEach(function(el) {
              self.repos.push(el)
            })
            console.log('print')
          }, 500)
        })
        .then(() => {
          setTimeout(function() {
            $('[data-toggle="tooltip"]').tooltip();
          }, 500)
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
        $('.hero-bg').css('background-position-y', - 250 + (scrollPos / 2) + 'px')
        $('.hero h1').css('transform', 'translateY(' + (scrollPos / 3) + 'px)')
        $('.hero-link').css('transform', 'translateY(' + (scrollPos / 6) + 'px)')
        // infinite scroll
        if (window.innerHeight + window.scrollY + 1 >= document.body.scrollHeight) {
          if (vm.switchUsername || vm.repos.length === 0) { return }
          if (!vm.next) { return }
          vm.page++
          vm.fetchApi()
        }
      })
    },
    search: function() {
      $('html, body').animate({ scrollTop: $('#app').offset().top - 40 })
      this.page = 1
      this.repos = []
      this.next = true
      this.fetchApi()
    }
  }
});
