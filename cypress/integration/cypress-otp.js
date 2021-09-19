describe('QR Code scan and generate OTP', () => {

    const otp = 'M44Q43EC22AZXIRYGE4K35CAWFGQJUPM3RBNYDGKD33CTKUV7A3A===='
    let actualOTP = ''

    it('QR Code Screenshot and decode otp', function () {

        cy.visit('/')
        cy.get('#QR_CODE_Generator_FREE_TEXT').type(otp, { force: true })

        // Hides the header
        cy.get('.header').then(function ($topbar) {
            $topbar[0].setAttribute('hidden', '')
        }).should('have.attr', 'hidden')

        // Takes Screenshot of QR Code and decodes it
        cy.get('canvas#canvasshow').screenshot(`${this.test.title}`).then(function () {
            cy.task("readQRCode", `../screenshots/${Cypress.spec.name}/${this.test.title}.png`).then(responseOTP => {
                expect(responseOTP.trim()).to.eq(otp)
                cy.log(responseOTP)
                actualOTP = responseOTP;
            })
        })
    });

    it('Generate OTP using the otpToken', function () {
        cy.task("generateOTP", actualOTP).then(otpToken => {
            cy.log(otpToken);
        });
    })

});
