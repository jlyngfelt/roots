//Här skapar man sin profil, man blir hitskickad efter Register för att fylla i sin användarinformation och skickas sedan vidare till (tabs)explore
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { Button, Input, Text } from 'tamagui'
import { useAuth } from '../contexts/AuthContext'
import { createUserProfile } from '../services/userService'

export default function CreateProfileScreen() {
	const router = useRouter()
	const { user } = useAuth()
	const [username, setUsername] = useState('')
	const [postalCode, setPostalCode] = useState('')
	const [bio, setBio] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleCreateProfile = async () => {
		setError('')

		if (!username.trim()) {
			setError('Username is required')
			return
		}

		if (!user) {
			setError('No user logged in')
			return
		}

		setLoading(true)

		try {
			await createUserProfile(user.uid, {
				username: username.trim(),
				postalCode: postalCode.trim(),
				bio: bio.trim(),
				profileImageUrl: ''
			})

			console.log('Profile created successfully!')
			router.replace('/(tabs)/explore')
		} catch (err) {
			console.error('Error creating profile:', err)
			setError('Failed to create profile. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: 'blue',
				justifyContent: 'center',
				alignItems: 'center',
				padding: 20
			}}
		>
			<Text style={{ fontSize: 20, color: 'green', marginBottom: 20 }}>
				Skapa din profil
			</Text>

			<Input
				value={username}
				onChangeText={setUsername}
				placeholder="Användarnamn"
				autoCapitalize="none"
				size="$4"
				marginVertical="10"
				width="80%"
			/>

			<Input
				value={postalCode}
				onChangeText={setPostalCode}
				placeholder="Postnummer"
				autoCapitalize="characters"
				size="$4"
				marginVertical="10"
				width="80%"
			/>

			<Input
				value={bio}
				onChangeText={setBio}
				placeholder="Beskrivning..."
				multiline
				numberOfLines={3}
				size="$4"
				marginVertical="10"
				width="80%"
			/>

			{error ? (
				<Text fontSize="$3" color="red" marginVertical="10">
					{error}
				</Text>
			) : null}

			<Button
				onPress={handleCreateProfile}
				color="#841584"
				size="$4"
				marginVertical="10"
				disabled={loading}
			>
				{loading ? 'Sparar...' : 'Spara'}
			</Button>
		</View>
	)
}
