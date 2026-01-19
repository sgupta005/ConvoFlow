export function getInitials(name: string) {
    return name.split(' ').map((s) => s.charAt(0).toUpperCase())
}