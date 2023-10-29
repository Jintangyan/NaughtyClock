import { Text, TouchableOpacity } from 'react-native'

export function SignoutButton(props) {
    return (
        <TouchableOpacity onPress={() => props.signout()}>
            <Text> Sign out</Text>
        </TouchableOpacity>
    )
}