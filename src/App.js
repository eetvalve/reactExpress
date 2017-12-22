import React from 'react'

import WeatherList from './components/WeatherList'
import HelloText from './components/Hellotext'

import Header from './router'

const App = () => (
    <div>
        <Header/>
        <HelloText/>
        <WeatherList/>
    </div>
)

export default App