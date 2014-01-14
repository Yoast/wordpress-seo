<?php
/*
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */


  /**
   * The "elections" collection of methods.
   * Typical usage is:
   *  <code>
   *   $civicinfoService = new Google_CivicInfoService(...);
   *   $elections = $civicinfoService->elections;
   *  </code>
   */
  class Google_ElectionsServiceResource extends Google_ServiceResource {

    /**
     * List of available elections to query. (elections.electionQuery)
     *
     * @param array $optParams Optional parameters.
     * @return Google_ElectionsQueryResponse
     */
    public function electionQuery($optParams = array()) {
      $params = array();
      $params = array_merge($params, $optParams);
      $data = $this->__call('electionQuery', array($params));
      if ($this->useObjects()) {
        return new Google_ElectionsQueryResponse($data);
      } else {
        return $data;
      }
    }
    /**
     * Looks up information relevant to a voter based on the voter's registered address.
     * (elections.voterInfoQuery)
     *
     * @param string $electionId The unique ID of the election to look up. A list of election IDs can be obtained at.https://www.googleapis.com/civicinfo/{version}/elections
     * @param Google_VoterInfoRequest $postBody
     * @param array $optParams Optional parameters.
     *
     * @opt_param bool officialOnly If set to true, only data from official state sources will be returned.
     * @return Google_VoterInfoResponse
     */
    public function voterInfoQuery($electionId, Google_VoterInfoRequest $postBody, $optParams = array()) {
      $params = array('electionId' => $electionId, 'postBody' => $postBody);
      $params = array_merge($params, $optParams);
      $data = $this->__call('voterInfoQuery', array($params));
      if ($this->useObjects()) {
        return new Google_VoterInfoResponse($data);
      } else {
        return $data;
      }
    }
  }

/**
 * Service definition for Google_CivicInfo (us_v1).
 *
 * <p>
 * An API for accessing civic information.
 * </p>
 *
 * <p>
 * For more information about this service, see the
 * <a href="https://developers.google.com/civic-information" target="_blank">API Documentation</a>
 * </p>
 *
 * @author Google, Inc.
 */
class Google_CivicInfoService extends Google_Service {
  public $elections;
  /**
   * Constructs the internal representation of the CivicInfo service.
   *
   * @param Google_Client $client
   */
  public function __construct(Google_Client $client) {
    $this->servicePath = 'civicinfo/us_v1/';
    $this->version = 'us_v1';
    $this->serviceName = 'civicinfo';

    $client->addService($this->serviceName, $this->version);
    $this->elections = new Google_ElectionsServiceResource($this, $this->serviceName, 'elections', json_decode('{"methods": {"electionQuery": {"id": "civicinfo.elections.electionQuery", "path": "elections", "httpMethod": "GET", "response": {"$ref": "ElectionsQueryResponse"}}, "voterInfoQuery": {"id": "civicinfo.elections.voterInfoQuery", "path": "voterinfo/{electionId}/lookup", "httpMethod": "POST", "parameters": {"electionId": {"type": "string", "required": true, "format": "int64", "location": "path"}, "officialOnly": {"type": "boolean", "default": "false", "location": "query"}}, "request": {"$ref": "VoterInfoRequest"}, "response": {"$ref": "VoterInfoResponse"}}}}', true));

  }
}



class Google_AdministrationRegion extends Google_Model {
  protected $__electionAdministrationBodyType = 'Google_AdministrativeBody';
  protected $__electionAdministrationBodyDataType = '';
  public $electionAdministrationBody;
  public $id;
  protected $__local_jurisdictionType = 'Google_AdministrationRegion';
  protected $__local_jurisdictionDataType = '';
  public $local_jurisdiction;
  public $name;
  protected $__sourcesType = 'Google_Source';
  protected $__sourcesDataType = 'array';
  public $sources;
  public function setElectionAdministrationBody(Google_AdministrativeBody $electionAdministrationBody) {
    $this->electionAdministrationBody = $electionAdministrationBody;
  }
  public function getElectionAdministrationBody() {
    return $this->electionAdministrationBody;
  }
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  public function setLocal_jurisdiction(Google_AdministrationRegion $local_jurisdiction) {
    $this->local_jurisdiction = $local_jurisdiction;
  }
  public function getLocal_jurisdiction() {
    return $this->local_jurisdiction;
  }
  public function setName( $name) {
    $this->name = $name;
  }
  public function getName() {
    return $this->name;
  }
  public function setSources(/* array(Google_Source) */ $sources) {
    $this->assertIsArray($sources, 'Google_Source', __METHOD__);
    $this->sources = $sources;
  }
  public function getSources() {
    return $this->sources;
  }
}

class Google_AdministrativeBody extends Google_Model {
  public $absenteeVotingInfoUrl;
  public $ballotInfoUrl;
  protected $__correspondenceAddressType = 'Google_SimpleAddressType';
  protected $__correspondenceAddressDataType = '';
  public $correspondenceAddress;
  public $electionInfoUrl;
  protected $__electionOfficialsType = 'Google_ElectionOfficial';
  protected $__electionOfficialsDataType = 'array';
  public $electionOfficials;
  public $electionRegistrationConfirmationUrl;
  public $electionRegistrationUrl;
  public $electionRulesUrl;
  public $hoursOfOperation;
  public $name;
  protected $__physicalAddressType = 'Google_SimpleAddressType';
  protected $__physicalAddressDataType = '';
  public $physicalAddress;
  public $voter_services;
  public $votingLocationFinderUrl;
  public function setAbsenteeVotingInfoUrl( $absenteeVotingInfoUrl) {
    $this->absenteeVotingInfoUrl = $absenteeVotingInfoUrl;
  }
  public function getAbsenteeVotingInfoUrl() {
    return $this->absenteeVotingInfoUrl;
  }
  public function setBallotInfoUrl( $ballotInfoUrl) {
    $this->ballotInfoUrl = $ballotInfoUrl;
  }
  public function getBallotInfoUrl() {
    return $this->ballotInfoUrl;
  }
  public function setCorrespondenceAddress(Google_SimpleAddressType $correspondenceAddress) {
    $this->correspondenceAddress = $correspondenceAddress;
  }
  public function getCorrespondenceAddress() {
    return $this->correspondenceAddress;
  }
  public function setElectionInfoUrl( $electionInfoUrl) {
    $this->electionInfoUrl = $electionInfoUrl;
  }
  public function getElectionInfoUrl() {
    return $this->electionInfoUrl;
  }
  public function setElectionOfficials(/* array(Google_ElectionOfficial) */ $electionOfficials) {
    $this->assertIsArray($electionOfficials, 'Google_ElectionOfficial', __METHOD__);
    $this->electionOfficials = $electionOfficials;
  }
  public function getElectionOfficials() {
    return $this->electionOfficials;
  }
  public function setElectionRegistrationConfirmationUrl( $electionRegistrationConfirmationUrl) {
    $this->electionRegistrationConfirmationUrl = $electionRegistrationConfirmationUrl;
  }
  public function getElectionRegistrationConfirmationUrl() {
    return $this->electionRegistrationConfirmationUrl;
  }
  public function setElectionRegistrationUrl( $electionRegistrationUrl) {
    $this->electionRegistrationUrl = $electionRegistrationUrl;
  }
  public function getElectionRegistrationUrl() {
    return $this->electionRegistrationUrl;
  }
  public function setElectionRulesUrl( $electionRulesUrl) {
    $this->electionRulesUrl = $electionRulesUrl;
  }
  public function getElectionRulesUrl() {
    return $this->electionRulesUrl;
  }
  public function setHoursOfOperation( $hoursOfOperation) {
    $this->hoursOfOperation = $hoursOfOperation;
  }
  public function getHoursOfOperation() {
    return $this->hoursOfOperation;
  }
  public function setName( $name) {
    $this->name = $name;
  }
  public function getName() {
    return $this->name;
  }
  public function setPhysicalAddress(Google_SimpleAddressType $physicalAddress) {
    $this->physicalAddress = $physicalAddress;
  }
  public function getPhysicalAddress() {
    return $this->physicalAddress;
  }
  public function setVoter_services(/* array(Google_string) */ $voter_services) {
    $this->assertIsArray($voter_services, 'Google_string', __METHOD__);
    $this->voter_services = $voter_services;
  }
  public function getVoter_services() {
    return $this->voter_services;
  }
  public function setVotingLocationFinderUrl( $votingLocationFinderUrl) {
    $this->votingLocationFinderUrl = $votingLocationFinderUrl;
  }
  public function getVotingLocationFinderUrl() {
    return $this->votingLocationFinderUrl;
  }
}

class Google_Candidate extends Google_Model {
  public $candidateUrl;
  protected $__channelsType = 'Google_Channel';
  protected $__channelsDataType = 'array';
  public $channels;
  public $email;
  public $name;
  public $orderOnBallot;
  public $party;
  public $phone;
  public $photoUrl;
  public function setCandidateUrl( $candidateUrl) {
    $this->candidateUrl = $candidateUrl;
  }
  public function getCandidateUrl() {
    return $this->candidateUrl;
  }
  public function setChannels(/* array(Google_Channel) */ $channels) {
    $this->assertIsArray($channels, 'Google_Channel', __METHOD__);
    $this->channels = $channels;
  }
  public function getChannels() {
    return $this->channels;
  }
  public function setEmail( $email) {
    $this->email = $email;
  }
  public function getEmail() {
    return $this->email;
  }
  public function setName( $name) {
    $this->name = $name;
  }
  public function getName() {
    return $this->name;
  }
  public function setOrderOnBallot( $orderOnBallot) {
    $this->orderOnBallot = $orderOnBallot;
  }
  public function getOrderOnBallot() {
    return $this->orderOnBallot;
  }
  public function setParty( $party) {
    $this->party = $party;
  }
  public function getParty() {
    return $this->party;
  }
  public function setPhone( $phone) {
    $this->phone = $phone;
  }
  public function getPhone() {
    return $this->phone;
  }
  public function setPhotoUrl( $photoUrl) {
    $this->photoUrl = $photoUrl;
  }
  public function getPhotoUrl() {
    return $this->photoUrl;
  }
}

class Google_Channel extends Google_Model {
  public $id;
  public $type;
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  public function setType( $type) {
    $this->type = $type;
  }
  public function getType() {
    return $this->type;
  }
}

class Google_Contest extends Google_Model {
  public $ballotPlacement;
  protected $__candidatesType = 'Google_Candidate';
  protected $__candidatesDataType = 'array';
  public $candidates;
  protected $__districtType = 'Google_ElectoralDistrict';
  protected $__districtDataType = '';
  public $district;
  public $electorateSpecifications;
  public $id;
  public $level;
  public $numberElected;
  public $numberVotingFor;
  public $office;
  public $primaryParty;
  public $referendumSubtitle;
  public $referendumTitle;
  public $referendumUrl;
  protected $__sourcesType = 'Google_Source';
  protected $__sourcesDataType = 'array';
  public $sources;
  public $special;
  public $type;
  public function setBallotPlacement( $ballotPlacement) {
    $this->ballotPlacement = $ballotPlacement;
  }
  public function getBallotPlacement() {
    return $this->ballotPlacement;
  }
  public function setCandidates(/* array(Google_Candidate) */ $candidates) {
    $this->assertIsArray($candidates, 'Google_Candidate', __METHOD__);
    $this->candidates = $candidates;
  }
  public function getCandidates() {
    return $this->candidates;
  }
  public function setDistrict(Google_ElectoralDistrict $district) {
    $this->district = $district;
  }
  public function getDistrict() {
    return $this->district;
  }
  public function setElectorateSpecifications( $electorateSpecifications) {
    $this->electorateSpecifications = $electorateSpecifications;
  }
  public function getElectorateSpecifications() {
    return $this->electorateSpecifications;
  }
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  public function setLevel( $level) {
    $this->level = $level;
  }
  public function getLevel() {
    return $this->level;
  }
  public function setNumberElected( $numberElected) {
    $this->numberElected = $numberElected;
  }
  public function getNumberElected() {
    return $this->numberElected;
  }
  public function setNumberVotingFor( $numberVotingFor) {
    $this->numberVotingFor = $numberVotingFor;
  }
  public function getNumberVotingFor() {
    return $this->numberVotingFor;
  }
  public function setOffice( $office) {
    $this->office = $office;
  }
  public function getOffice() {
    return $this->office;
  }
  public function setPrimaryParty( $primaryParty) {
    $this->primaryParty = $primaryParty;
  }
  public function getPrimaryParty() {
    return $this->primaryParty;
  }
  public function setReferendumSubtitle( $referendumSubtitle) {
    $this->referendumSubtitle = $referendumSubtitle;
  }
  public function getReferendumSubtitle() {
    return $this->referendumSubtitle;
  }
  public function setReferendumTitle( $referendumTitle) {
    $this->referendumTitle = $referendumTitle;
  }
  public function getReferendumTitle() {
    return $this->referendumTitle;
  }
  public function setReferendumUrl( $referendumUrl) {
    $this->referendumUrl = $referendumUrl;
  }
  public function getReferendumUrl() {
    return $this->referendumUrl;
  }
  public function setSources(/* array(Google_Source) */ $sources) {
    $this->assertIsArray($sources, 'Google_Source', __METHOD__);
    $this->sources = $sources;
  }
  public function getSources() {
    return $this->sources;
  }
  public function setSpecial( $special) {
    $this->special = $special;
  }
  public function getSpecial() {
    return $this->special;
  }
  public function setType( $type) {
    $this->type = $type;
  }
  public function getType() {
    return $this->type;
  }
}

class Google_Election extends Google_Model {
  public $electionDay;
  public $id;
  public $name;
  public function setElectionDay( $electionDay) {
    $this->electionDay = $electionDay;
  }
  public function getElectionDay() {
    return $this->electionDay;
  }
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  public function setName( $name) {
    $this->name = $name;
  }
  public function getName() {
    return $this->name;
  }
}

class Google_ElectionOfficial extends Google_Model {
  public $emailAddress;
  public $faxNumber;
  public $name;
  public $officePhoneNumber;
  public $title;
  public function setEmailAddress( $emailAddress) {
    $this->emailAddress = $emailAddress;
  }
  public function getEmailAddress() {
    return $this->emailAddress;
  }
  public function setFaxNumber( $faxNumber) {
    $this->faxNumber = $faxNumber;
  }
  public function getFaxNumber() {
    return $this->faxNumber;
  }
  public function setName( $name) {
    $this->name = $name;
  }
  public function getName() {
    return $this->name;
  }
  public function setOfficePhoneNumber( $officePhoneNumber) {
    $this->officePhoneNumber = $officePhoneNumber;
  }
  public function getOfficePhoneNumber() {
    return $this->officePhoneNumber;
  }
  public function setTitle( $title) {
    $this->title = $title;
  }
  public function getTitle() {
    return $this->title;
  }
}

class Google_ElectionsQueryResponse extends Google_Model {
  protected $__electionsType = 'Google_Election';
  protected $__electionsDataType = 'array';
  public $elections;
  public $kind;
  public function setElections(/* array(Google_Election) */ $elections) {
    $this->assertIsArray($elections, 'Google_Election', __METHOD__);
    $this->elections = $elections;
  }
  public function getElections() {
    return $this->elections;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
}

class Google_ElectoralDistrict extends Google_Model {
  public $id;
  public $name;
  public $scope;
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  public function setName( $name) {
    $this->name = $name;
  }
  public function getName() {
    return $this->name;
  }
  public function setScope( $scope) {
    $this->scope = $scope;
  }
  public function getScope() {
    return $this->scope;
  }
}

class Google_PollingLocation extends Google_Model {
  protected $__addressType = 'Google_SimpleAddressType';
  protected $__addressDataType = '';
  public $address;
  public $endDate;
  public $id;
  public $name;
  public $notes;
  public $pollingHours;
  protected $__sourcesType = 'Google_Source';
  protected $__sourcesDataType = 'array';
  public $sources;
  public $startDate;
  public $voterServices;
  public function setAddress(Google_SimpleAddressType $address) {
    $this->address = $address;
  }
  public function getAddress() {
    return $this->address;
  }
  public function setEndDate( $endDate) {
    $this->endDate = $endDate;
  }
  public function getEndDate() {
    return $this->endDate;
  }
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  public function setName( $name) {
    $this->name = $name;
  }
  public function getName() {
    return $this->name;
  }
  public function setNotes( $notes) {
    $this->notes = $notes;
  }
  public function getNotes() {
    return $this->notes;
  }
  public function setPollingHours( $pollingHours) {
    $this->pollingHours = $pollingHours;
  }
  public function getPollingHours() {
    return $this->pollingHours;
  }
  public function setSources(/* array(Google_Source) */ $sources) {
    $this->assertIsArray($sources, 'Google_Source', __METHOD__);
    $this->sources = $sources;
  }
  public function getSources() {
    return $this->sources;
  }
  public function setStartDate( $startDate) {
    $this->startDate = $startDate;
  }
  public function getStartDate() {
    return $this->startDate;
  }
  public function setVoterServices( $voterServices) {
    $this->voterServices = $voterServices;
  }
  public function getVoterServices() {
    return $this->voterServices;
  }
}

class Google_SimpleAddressType extends Google_Model {
  public $city;
  public $line1;
  public $line2;
  public $line3;
  public $locationName;
  public $state;
  public $zip;
  public function setCity( $city) {
    $this->city = $city;
  }
  public function getCity() {
    return $this->city;
  }
  public function setLine1( $line1) {
    $this->line1 = $line1;
  }
  public function getLine1() {
    return $this->line1;
  }
  public function setLine2( $line2) {
    $this->line2 = $line2;
  }
  public function getLine2() {
    return $this->line2;
  }
  public function setLine3( $line3) {
    $this->line3 = $line3;
  }
  public function getLine3() {
    return $this->line3;
  }
  public function setLocationName( $locationName) {
    $this->locationName = $locationName;
  }
  public function getLocationName() {
    return $this->locationName;
  }
  public function setState( $state) {
    $this->state = $state;
  }
  public function getState() {
    return $this->state;
  }
  public function setZip( $zip) {
    $this->zip = $zip;
  }
  public function getZip() {
    return $this->zip;
  }
}

class Google_Source extends Google_Model {
  public $name;
  public $official;
  public function setName( $name) {
    $this->name = $name;
  }
  public function getName() {
    return $this->name;
  }
  public function setOfficial( $official) {
    $this->official = $official;
  }
  public function getOfficial() {
    return $this->official;
  }
}

class Google_VoterInfoRequest extends Google_Model {
  public $address;
  public function setAddress( $address) {
    $this->address = $address;
  }
  public function getAddress() {
    return $this->address;
  }
}

class Google_VoterInfoResponse extends Google_Model {
  protected $__contestsType = 'Google_Contest';
  protected $__contestsDataType = 'array';
  public $contests;
  protected $__earlyVoteSitesType = 'Google_PollingLocation';
  protected $__earlyVoteSitesDataType = 'array';
  public $earlyVoteSites;
  protected $__electionType = 'Google_Election';
  protected $__electionDataType = '';
  public $election;
  public $kind;
  protected $__normalizedInputType = 'Google_SimpleAddressType';
  protected $__normalizedInputDataType = '';
  public $normalizedInput;
  protected $__pollingLocationsType = 'Google_PollingLocation';
  protected $__pollingLocationsDataType = 'array';
  public $pollingLocations;
  protected $__stateType = 'Google_AdministrationRegion';
  protected $__stateDataType = 'array';
  public $state;
  public $status;
  public function setContests(/* array(Google_Contest) */ $contests) {
    $this->assertIsArray($contests, 'Google_Contest', __METHOD__);
    $this->contests = $contests;
  }
  public function getContests() {
    return $this->contests;
  }
  public function setEarlyVoteSites(/* array(Google_PollingLocation) */ $earlyVoteSites) {
    $this->assertIsArray($earlyVoteSites, 'Google_PollingLocation', __METHOD__);
    $this->earlyVoteSites = $earlyVoteSites;
  }
  public function getEarlyVoteSites() {
    return $this->earlyVoteSites;
  }
  public function setElection(Google_Election $election) {
    $this->election = $election;
  }
  public function getElection() {
    return $this->election;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
  public function setNormalizedInput(Google_SimpleAddressType $normalizedInput) {
    $this->normalizedInput = $normalizedInput;
  }
  public function getNormalizedInput() {
    return $this->normalizedInput;
  }
  public function setPollingLocations(/* array(Google_PollingLocation) */ $pollingLocations) {
    $this->assertIsArray($pollingLocations, 'Google_PollingLocation', __METHOD__);
    $this->pollingLocations = $pollingLocations;
  }
  public function getPollingLocations() {
    return $this->pollingLocations;
  }
  public function setState(/* array(Google_AdministrationRegion) */ $state) {
    $this->assertIsArray($state, 'Google_AdministrationRegion', __METHOD__);
    $this->state = $state;
  }
  public function getState() {
    return $this->state;
  }
  public function setStatus( $status) {
    $this->status = $status;
  }
  public function getStatus() {
    return $this->status;
  }
}
