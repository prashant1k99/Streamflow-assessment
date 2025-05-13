type Status = 'pending' | 'success' | 'error'

export function createSuspenseResource<T>(promise: Promise<T>) {
	let status: Status = 'pending'
	let result: T
	let error: Error

	const suspender = promise.then(
		(data) => {
			status = 'success'
			result = data
		},
		(e) => {
			status = 'error'
			error = e
		}
	)

	return {
		read() {
			if (status === 'pending') {
				throw suspender
			} else if (status === 'error') {
				throw error
			} else {
				return result
			}
		},
	}
}

// Cache for memoizing resources
const resourceCache = new Map<string, unknown>()

export function createCachedResource<T>(
	key: string,
	fetchFn: () => Promise<T>
) {
	if (!resourceCache.has(key)) {
		resourceCache.set(key, createSuspenseResource(fetchFn()))
	}
	return resourceCache.get(key)
}
