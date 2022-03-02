let app = new Vue({
    el: '#app',
    data: {
        message: 'Hello world',
        startHour: 8,
        endHour:24,
        timeArr: [],
        dataItems: {},
        today: null,
        LS: null,
    },
    methods: {
        getTimeArr() {
            let tmp = 0; // tmp is the minute
            while (this.startHour <= this.endHour) {
                this.timeArr.push(`${this.startHour%24}:${tmp===0?'00':tmp} ${this.startHour<12?'am.':'pm.'}`);
                
                // do something
                tmp+=30;
                if (tmp === 60)  this.startHour++;
                tmp%=60;
            }
            // console.log(this.timeArr);
            // create data item
            this.createDataItems();
        },
        createDataItems() {
            // set localStorage or get
            let LS = localStorage.getItem(this.today);
            if (LS) {
                // exist
                this.dataItems = JSON.parse(LS);
                // console.log(this.dataItems)
            } else {
                for (let i = 0; i < this.timeArr.length; i += 1) {
                    this.dataItems[this.timeArr[i]] = {
                        time: this.timeArr[i],
                        state: 0,
                        content: '',
                        idx: i,
                    }
                }
                this.updateLS();
            }

        },
        getToday() {
            const t = new Date();
            this.today = `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`; 
        },
        saveContent(item) {
            // console.log(item)
            // console.log(item.idx)
            let text = document.getElementsByTagName('textarea')[item.idx];
            const dataTmp = this.dataItems[item.time];
            dataTmp.content = text.value;
            this.messageInfo(item, 'content');
            this.updateLS();
        },
        updateState(item) {
            let select = document.getElementsByTagName('select')[item.idx];
            let ops = select.children;
            for (let i = 0; i < ops.length; i += 1) {
                if (ops[i].selected) {
                    const dataTmp = this.dataItems[item.time];
                    dataTmp.state = i;
                    this.updateLS();
                    this.messageInfo(item, 'state');
                    break;
                }
            }
        },
        updateLS() {
            localStorage.setItem(this.today, JSON.stringify(this.dataItems));
        },
        messageInfo(item, type) {
            this.message = `${item.time}的${type}已经更新完成laaaa！`;
        }
    },
    mounted() {
         // update today
        this.getToday();
         // get time arr
        this.getTimeArr();
    },
})