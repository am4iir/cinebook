
const timeFormat = (minutes)=>{
    const hours = Math.floor(minutes / 60);
    const minutesremaining = minutes % 60;
    return `${hours}h ${minutesremaining}m`;
}

export default timeFormat;