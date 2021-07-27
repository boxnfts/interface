(function() {
    const doc = document
    const rootEl = doc.documentElement
    const body = doc.body
    const sr = window.sr = ScrollReveal({
        mobile: false
    })
    rootEl.classList.remove('no-js')
    rootEl.classList.add('js')
    window.addEventListener('load', function() {
        body.classList.add('is-loaded')
    })

    function revealAnimations() {
        sr.reveal('.hero-section', {
            duration: 600,
            distance: '100px',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            origin: 'bottom',
            viewFactor: 0.6
        })
    }
    if (body.classList.contains('has-animations')) {
        window.addEventListener('load', revealAnimations)
    }
    let Bubble = function(parentNode) {
        let self = this
        self.parentNode = parentNode
        self.getCanvasSize()
        window.addEventListener('resize', function() {
            self.getCanvasSize()
        })
        self.mouseX = 0
        self.mouseY = 0
        window.addEventListener('mousemove', function(e) {
            self.mouseX = e.clientX
            self.mouseY = e.clientY
        })
        self.randomise()
    }
    Bubble.prototype.getCanvasSize = function() {
        let self = this
        self.canvasWidth = self.parentNode.clientWidth
        self.canvasHeight = self.parentNode.clientHeight
    }
    Bubble.prototype.generateDecimalBetween = function(min, max) {
        return (Math.random() * (min - max) + max).toFixed(2)
    }
    Bubble.prototype.update = function() {
        let self = this
        self.translateX = self.translateX - self.movementX
        self.translateY = self.translateY - self.movementY
        self.posX += ((self.mouseX / (self.staticity / self.magnetism)) - self.posX) / self.smoothFactor
        self.posY += ((self.mouseY / (self.staticity / self.magnetism)) - self.posY) / self.smoothFactor
        if (self.translateY + self.posY < 0 || self.translateX + self.posX < 0 || self.translateX + self.posX > self.canvasWidth) {
            self.randomise()
            self.translateY = self.canvasHeight
        }
    }
    Bubble.prototype.randomise = function() {
        let self = this
        self.colors = ['221,88,108', '126,31,215', '221,88,108', '37,26,222', '243, 244, 255', ]
        self.velocity = 13
        self.smoothFactor = 40
        self.staticity = 10
        self.magnetism = 0.1 + Math.random() * 4
        self.color = self.colors[Math.floor(Math.random() * self.colors.length)]
        self.alpha = self.generateDecimalBetween(2, 8) / 10
        self.size = self.generateDecimalBetween(10, 60)
        self.posX = 0
        self.posY = 0
        self.movementX = self.generateDecimalBetween(-2, 2) / self.velocity
        self.movementY = self.generateDecimalBetween(1, 20) / self.velocity
        self.translateX = self.generateDecimalBetween(0, self.canvasWidth)
        self.translateY = self.generateDecimalBetween(0, self.canvasHeight)
    }
    let Background = function(selector) {
        let self = this
        self.canvas = document.getElementById(selector)
        self.ctx = this.canvas.getContext('2d')
        self.dpr = window.devicePixelRatio
    }
    Background.prototype.start = function() {
        let self = this
        self.canvasSize()
        window.addEventListener('resize', function() {
            self.canvasSize()
        })
        self.bubblesList = []
        self.generateBubbles()
        self.animate()
    }
    Background.prototype.canvasSize = function() {
        let self = this
        self.container = self.canvas.parentNode
        self.w = self.container.offsetWidth
        self.h = self.container.offsetHeight
        self.wdpi = self.w * self.dpr
        self.hdpi = self.h * self.dpr
        self.canvas.width = self.wdpi
        self.canvas.height = self.hdpi
        self.canvas.style.width = self.w + 'px'
        self.canvas.style.height = self.h + 'px'
        self.ctx.scale(self.dpr, self.dpr)
    }
    Background.prototype.animate = function() {
        let self = this
        self.ctx.clearRect(0, 0, self.canvas.clientWidth, self.canvas.clientHeight)
        self.bubblesList.forEach(function(bubble) {
            bubble.update()
            self.ctx.translate(bubble.translateX, bubble.translateY)
            self.ctx.beginPath()
            self.ctx.arc(bubble.posX, bubble.posY, bubble.size, 0, 2 * Math.PI)
            self.ctx.fillStyle = 'rgba(' + bubble.color + ',' + bubble.alpha + ')'
            self.ctx.fill()
            self.ctx.setTransform(self.dpr, 0, 0, self.dpr, 0, 0)
        })
        requestAnimationFrame(this.animate.bind(this))
    }
    Background.prototype.addBubble = function(bubble) {
        return this.bubblesList.push(bubble)
    }
    Background.prototype.generateBubbles = function() {
        let self = this
        for (let i = 0; i < self.bubbleDensity(); i++) {
            self.addBubble(new Bubble(self.canvas.parentNode))
        }
    }
    Background.prototype.bubbleDensity = function() {
        return 7
    }
    window.addEventListener('load', function() {
        const heroParticles = new Background('floating-dot')
        const heroParticles_2 = new Background('floating-dot-2')
        const heroParticles_3 = new Background('floating-dot-3')
        heroParticles.start();
        heroParticles_2.start();
        heroParticles_3.start();
    })
}())
$(document).ready(function() {
    var header_offset = $('#header').height();
    var chart_legend_padding = 20;
    var wind_w = $(window).width();
    $('.navbar-collapse a.scrollToSection').click(function(e) {
        console.log(header_offset);
        e.preventDefault();
        $(".navbar-collapse").collapse('hide');
        var $href = $(this).attr('href');
        var $anchor = $($href).offset();
        window.scrollTo($anchor.left, ($anchor.top - header_offset));
    });
    $(window).on('resize', function() {
        wind_w = $(window).width();
        updateChart();
    }).trigger('resize');

    function updateChart() {
        chart_legend_padding = wind_w > 768 ? 20 : 10;
    }
    $('[data-toggle="tooltip"]').tooltip()
    feather.replace()
    var header = document.getElementById("header");
    var sticky = header.offsetTop;
    window.onscroll = function() {
        checkScroll()
    };

    function checkScroll() {
        $(".navbar-collapse").collapse('hide');
        if (window.pageYOffset > sticky) {
            $('header').addClass('sticky');
        } else {
            $('header').removeClass('sticky');
        }
    }
    var ctx = document.getElementById('polkaChart').getContext('2d');
    var polkaChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Seed: 5%', 'Strategic: 14% ', 'Public sale: 3%', 'Team & Advisors: 20%', 'Liquidity (DEX & CEX): 14%', 'Farming vault: 6%', 'Staking pool: 5%', 'NFT Emissions: 5%', 'Marketing: 14%', 'Foundation: 14%'],
            datasets: [{
                data: [5, 14, 3, 20, 14, 6, 5, 5, 14, 14],
                backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 1,
                hoverOffset: 5,
            }]
        },
        options: {
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 15,
                    bottom: 0
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            var label = " " + tooltipItem.label;
                            return label;
                        }
                    }
                },
                title: {
                    Position: 'left',
                    Align: 'start',
                    padding: 100,
                },
                legend: {
                    position: 'bottom',
                    title: {
                        display: false,
                    },
                    labels: {
                        boxWidth: chart_legend_padding,
                        color: 'rgb(255, 255, 255)',
                        padding: chart_legend_padding,
                    },
                }
            }
        }
    });
})