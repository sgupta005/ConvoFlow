import icon from "data-url:~assets/icon.png"

export function Logo() {
  return <div className='flex items-center gap-2'>
    <img src={icon} alt="ConvoFlow" height={32} width={32} />
    <h1 className='font-medium text-base'>ConvoFlow</h1>
  </div>
}