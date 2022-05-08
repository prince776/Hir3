/** @type {Chai.Assert} */
let assert = global.assert
let artifacts = global.artifacts
let contract = global.contract
let before = global.before

const DHire = artifacts.require('DHire.sol')

require('chai').use(require('chai-as-promised')).should()

contract('DHire', ([deployer, author]) => {
    let dhire

    before(async () => {
        dhire = await DHire.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await dhire.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await dhire.name()
            assert.equal(name, 'DHire')
        })
    })

    describe('dhire', async () => {
        const docHash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'
        const name1 = 'name1'
        const bio1 = 'bio1', bio2 = 'bio2';
        const message1 = 'message1',
            message2 = 'message2'

        before(async () => {})

        it('register and get user', async () => {
            await dhire.registerUser('', '', { from: author }).should.be
                .rejected

            await dhire.getSelf({ from: author }).should.be.rejected;


            await dhire.registerUser(name1, bio1, { from: author }).should.not
                .be.rejected
            const user = await dhire.getUser(name1);
            assert.equal(user['0'], name1);
            assert.equal(user['1'], bio1);
            assert.equal(user['2'].toNumber(), 0);
            {
                await dhire.updateBio(bio2, { from: author }).should.not.be.rejected;
                const user = await dhire.getSelf({ from: author });
                assert.equal(user['0'], name1);
                assert.equal(user['1'], bio2);
                assert.equal(user['2'].toNumber(), 0);
            }
            await dhire.registerUser(name1, bio1, { from: author }).should.be
                .rejected
        })

        it('upload resume and get resume', async () => {
            await dhire.uploadResume(docHash, { from: author }).should.not.be
                .rejected
            const resumeCount = await dhire.resumeCount()
            assert.equal(resumeCount, 1)

            const user = await dhire.getUser(name1)
            assert.equal(user['2'].toNumber(), 1)

            const resume = await dhire.resumes(1)
            assert.equal(resume['0'].toNumber(), 1)
            assert.equal(resume['1'], docHash)
            assert.equal(resume['2'], name1)
        })

        it('send and get messages', async () => {
            await dhire.sendMessage(name1, '', { from: author }).should.be
                .rejected
            await dhire.sendMessage('', message1, { from: author }).should.be
                .rejected
            await dhire.sendMessage(name1, message1, { from: author }).should
                .not.be.rejected
            await dhire.sendMessage(name1, message2, { from: author }).should
                .not.be.rejected

            const messages = await dhire.getMessages({ from: author })
            const m1 = messages[0].split(':'),
                m2 = messages[1].split(':')
            assert.equal(m1[0], name1)
            assert.equal(m2[0], name1)

            assert.equal(m1[1], name1)
            assert.equal(m2[1], name1)

            assert.equal(m1[3], message1)
            assert.equal(m2[3], message2)
        })
    })
})
