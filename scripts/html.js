document.querySelector('.svg').innerHTML = `<svg viewBox="-250 -250 500 500" preserveAspectRatio="xMidYMid meet">
            <polygon points="200,0 
                100,173.2 
                -100,173.2 
                -200,0 
                -100,-173.2 
                100,-173.2"></polygon>
            
                <polygon points="133.3,0 
                66.6,115.4 
                -66.6,115.4 
                -133.3,0 
                -66.6,-115.4 
                66.6,-115.4"></polygon>
            
                <polygon points="66.6,0 
                33.3,57.8 
                -33.3,57.8 
                -66.6,0 
                -33.3,-57.8 
                33.3,-57.8"></polygon>

                <line x1="-33.3" y1="-57.8" x2="-66.6" y2="-115.4" stroke="white" stroke-width="2" class="line"></line>
                <line x1="100" y1="-173.2" x2="66.6" y2="-115.4" stroke="white" stroke-width="2" class="line"></line>
                <line x1="66.6" y1="115.4" x2="100" y2="173.2" stroke="white" stroke-width="2" class="line"></line>
                <line x1="-66.6" y1="115.4" x2="-33.3" y2="57.8" stroke="white" stroke-width="2" class="line"></line>
                <line x1="-200" y1="0" x2="-133.3" y2="0" stroke="white" stroke-width="2" class="line"></line>
                <line x1="66.6" y1="0" x2="133.3" y2="0" stroke="white" stroke-width="2" class="line"></line>

                <circle cx="200" cy="0" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button c1" onclick="click('c1')"></circle>
                <circle cx="100" cy="173.2" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button c2" onclick="click('c2')"></circle>
                <circle cx="-100" cy="173.2" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button c3" onclick="click('c3')"></circle>
                <circle cx="-200" cy="0" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button c4" onclick="click('c4')"></circle>
                <circle cx="-100" cy="-173.2" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button c5" onclick="click('c5')"></circle>
                <circle cx="100" cy="-173.2" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button c6" onclick="click('c6')"></circle>
            
                <circle cx="133.3" cy="0" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button b1" onclick="click('b1')"></circle>
                <circle cx="-133.3" cy="0" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button b2" onclick="click('b2')"></circle>
                <circle cx="66.6" cy="115.4" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button b3" onclick="click('b3')"></circle>
                <circle cx="66.6" cy="-115.4" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button b4" onclick="click('b4')"></circle>
                <circle cx="-66.6" cy="-115.4" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button b5" onclick="click('b5')"></circle>
                <circle cx="-66.6" cy="115.4" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button b6" onclick="click('b6')"></circle>
            
                <circle cx="66.6" cy="0" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button a1" onclick="click('a1')"></circle>
                <circle cx="-66.6" cy="0" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button a2" onclick="click('a2')"></circle>
                <circle cx="33.3" cy="57.8" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button a3" onclick="click('a3')"></circle>
                <circle cx="33.3" cy="-57.8" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button a4" onclick="click('a4')"></circle>
                <circle cx="-33.3" cy="57.8" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button a5" onclick="click('a5')"></circle>
                <circle cx="-33.3" cy="-57.8" r="10" fill="grey" stroke="black" stroke-width="2" class="circle-button a6" onclick="click('a6')"></circle>
        
                <text x="-40" y="-85" fill="darkorange" text-anchor="middle" font-size="20" class="text">1</text>
                <text x="-160" y="-10" fill="darkorange" text-anchor="middle" font-size="20" class="text">1</text>
                <text x="90" y="-10" fill="darkorange" text-anchor="middle" font-size="20" class="text">1</text>
                <text x="-60" y="80" fill="darkorange" text-anchor="middle" font-size="20" class="text">1</text>
                <text x="90" y="140" fill="darkorange" text-anchor="middle" font-size="20" class="text">1</text>          
                <text x="90" y="-125" fill="darkorange" text-anchor="middle" font-size="20" class="text">1</text>
                
                <text x="40" y="25" fill="darkorange" text-anchor="middle" font-size="20" class="text">8</text>
                <text x="-40" y="-20" fill="darkorange" text-anchor="middle" font-size="20" class="text">8</text>
                <text x="0" y="-35" fill="darkorange" text-anchor="middle" font-size="20" class="text">8</text>
                <text x="0" y="50" fill="darkorange" text-anchor="middle" font-size="20" class="text">8</text>
                <text x="40" y="-18" fill="darkorange" text-anchor="middle" font-size="20" class="text">9</text>          
                <text x="-40" y="27" fill="darkorange" text-anchor="middle" font-size="20" class="text">9</text>
                
                <text x="85" y="-55" fill="darkorange" text-anchor="middle" font-size="20" class="text">4</text>
                <text x="-90" y="55" fill="darkorange" text-anchor="middle" font-size="20" class="text">4</text>
                <text x="90" y="55" fill="darkorange" text-anchor="middle" font-size="20" class="text">5</text>
                <text x="-90" y="-50" fill="darkorange" text-anchor="middle" font-size="20" class="text">5</text>
                <text x="0" y="110" fill="darkorange" text-anchor="middle" font-size="20" class="text">6</text>          
                <text x="0" y="-95" fill="darkorange" text-anchor="middle" font-size="20" class="text">6</text>

                <text x="0" y="-150" fill="darkorange" text-anchor="middle" font-size="20" class="text">1</text>
                <text x="0" y="165" fill="darkorange" text-anchor="middle" font-size="20" class="text">1</text>
                <text x="140" y="80" fill="darkorange" text-anchor="middle" font-size="20" class="text">1</text>
                <text x="-140" y="-70" fill="darkorange" text-anchor="middle" font-size="20" class="text">2</text>
                <text x="140" y="-70" fill="darkorange" text-anchor="middle" font-size="20" class="text">2</text>          
                <text x="-130" y="100" fill="darkorange" text-anchor="middle" font-size="20" class="text">3</text>
        </svg>`;
