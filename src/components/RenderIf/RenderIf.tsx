interface Pars {
    children: any
    isTrue: any
}
export const RenderIf = ({ children, isTrue }: Pars) => {
    return isTrue ? children : null
}
