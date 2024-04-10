import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import { useSelector } from 'react-redux'; 



const options = {
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
    enableTooltip: true,
    deterministic: false,
    fontFamily: "impact",
    fontSizes: [5, 60],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 90],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000
  };
  
export function WordCloud() {
    const info = useSelector((store)=>store?.info);
    const words = info.skills ? Object.entries(info?.skills).map(([text, value]) => ({
        text,
        value
      })): [];
      
  return <ReactWordcloud options={options} words={words} />
}