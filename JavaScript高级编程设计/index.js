function test(arr) {
  let result = arr[0]
  let times = 1

  for (let i = 1; i < arr.length; i++) {
    console.log('每一轮开始时的i = ', i)
    console.log('每一轮开始时的result = ', result)
    console.log('每一轮开始时的times = ', times)
    console.log('----------')
    if (times === 0) {
      result = arr[i]
      times = 1
    } else if (arr[i] === result) {
      times++
    } else {
      times--
    }
  }
  return result
}
console.log(test([1, 2, 3, 2, 2, 2, 5, 4, 2, 1]))
