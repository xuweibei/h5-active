/*eslint-disable */
import React from 'react'
import "./eggs.css"
const imgs = require('../assets/images/egg0.png')
class Eggs extends React.Component {

    state = {
        egg: Array.from({length: 8}),
        source: imgs,
        isClick: false,
        eggCount: 8 // 鸡蛋个数
    }

    componentDidMount() {
        this.childs = [...this.eggs.children] 
    }

    clickEgg = (index) => {
        if (this.state.isClick || this.state.eggCount < 0) return
        this.setState({
            isClick: true
        })
        // 定義變量保存極大狀態
        // let isClick = false;
        let count = 3; //动画次数
        let imgSrc = this.childs[index].firstChild
        
        let num = 0;
        this.timer = setInterval(() => {
            if (num < 4) {
                console.log(num);
                imgSrc.src = require(`../assets/images/egg${num}.png`);
            } else {
                num = 0;
                count--;
            }
            console.log(count);
            if (count === 0) {
                clearInterval(this.timer); //停止动画
                // 处理业务逻辑
                console.log('蛋蛋破了');
                this.setState({
                    isClick: false
                })
                imgSrc.src = require(`../assets/images/egg5.png`);
            }
            num++
        }, 500)
        this.setState(pre => ({
            eggCount: pre.eggCount - 1
        })) //蛋数-1 
    }
    render() {
        return (
            <div className="container">
                <ul className="content" ref={ref => this.eggs = ref}>
                {
                    this.state.egg.map((item, index) => (
                        <li key={index} className="egg" onClick={() => this.clickEgg(index)} >
                            <img src={require('../assets/images/egg0.png')} alt=""/>
                        </li>
                    ))
                }
                </ul>
            </div>
        )
    }
}

export default Eggs